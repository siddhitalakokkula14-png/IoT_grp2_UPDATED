"""
Smart Agriculture Monitoring & Irrigation System
Flask Hardware Controller API Server for Raspberry Pi 4

Endpoints:
    GET  /api/status
    GET  /api/telemetry
        Returns live soil + water level telemetry. Motor control is external.
    GET  /api/camera/latest
    GET  /api/camera/image
    GET  /api/pump
    POST /api/pump
    POST /api/auto-irrigation

Hardware:
    Raspberry Pi 4
    FC-28 Soil Moisture Sensor -> ADS1115 A0
    ADS1115 -> I2C address 0x48
    Motor/pump -> external physical button/switch (not software controlled)
"""

import datetime
import io
import atexit
import os
import threading

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

try:
    from twilio.rest import Client as TwilioClient
except ImportError:
    TwilioClient = None


# ============================================================
# HARDWARE IMPORTS
# ============================================================

try:
    import board
    import busio
    import adafruit_ads1x15.ads1115 as ADS
    from adafruit_ads1x15.analog_in import AnalogIn
    HARDWARE_AVAILABLE = True

except (ImportError, NotImplementedError, RuntimeError) as e:

    HARDWARE_AVAILABLE = False

    print(
        "[WARNING] Raspberry Pi hardware libraries unavailable:"
    )
    print(e)


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__)

# Allow your React/Vite website to communicate with Flask
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)


# ============================================================
# GPIO CONFIGURATION
# ============================================================


# ============================================================
# GLOBAL STATES
# ============================================================

pump_state = "OFF"

relay_state = "inactive"

auto_irrigation_enabled = False

auto_threshold = 45

# Website alert thresholds (percent)
SOIL_MOISTURE_ALERT_THRESHOLD = 45
WATER_LEVEL_ALERT_THRESHOLD = 40

# ============================================================
# SMS / TWILIO CONFIGURATION
# ============================================================
# Keep these values ONLY on the Raspberry Pi. Never put them in the React app.
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '').strip()
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '').strip()
TWILIO_FROM_NUMBER = os.getenv('TWILIO_FROM_NUMBER', '').strip()
ALERT_PHONE_NUMBER = os.getenv('ALERT_PHONE_NUMBER', '').strip()
SMS_COOLDOWN_SECONDS = int(os.getenv('SMS_COOLDOWN_SECONDS', '600'))

_sms_lock = threading.Lock()
_last_sms_sent = {'soil': 0.0, 'water': 0.0}

def sms_is_configured():
    return bool(TwilioClient and TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER and ALERT_PHONE_NUMBER)

def send_sms_alert(alert_type, value):
    if not sms_is_configured():
        return {'sent': False, 'configured': False, 'message': 'Twilio SMS is not configured on the Raspberry Pi backend.'}
    if alert_type not in ('soil', 'water'):
        return {'sent': False, 'configured': True, 'message': 'Invalid alert type.'}
    now = datetime.datetime.now().timestamp()
    with _sms_lock:
        last_sent = _last_sms_sent.get(alert_type, 0.0)
        if now - last_sent < SMS_COOLDOWN_SECONDS:
            return {'sent': False, 'configured': True, 'cooldown': True, 'message': f'{alert_type} SMS is in cooldown.'}
        _last_sms_sent[alert_type] = now
    if alert_type == 'soil':
        body = f'SmartAgri Alert: Soil moisture is {value:.1f}%, below the 45% threshold. Please check the soil.'
    else:
        body = f'SmartAgri Alert: Water level is {value:.1f}%, below the 40% threshold. Please check the water tank.'
    try:
        client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(body=body, from_=TWILIO_FROM_NUMBER, to=ALERT_PHONE_NUMBER)
        return {'sent': True, 'configured': True, 'sid': message.sid, 'message': body}
    except Exception as exc:
        with _sms_lock:
            _last_sms_sent[alert_type] = 0.0
        print(f'[SMS ERROR] {exc}')
        return {'sent': False, 'configured': True, 'message': str(exc)}

# Water-level sensor calibration on ADS1115 @ 0x49, channel A0.
# Adjust these two voltages after checking the real sensor with a multimeter.
WATER_EMPTY_VOLTAGE = 0.50
WATER_FULL_VOLTAGE = 2.80

last_irrigation_time = None


# ============================================================
# GPIO INITIALIZATION
# ============================================================

def initialize_gpio():
    # Motor/relay control has intentionally been removed.
    # The motor is operated by the external physical button/switch.
    print("[INFO] Motor control disabled in software; use the physical button/switch.")


# ============================================================
# PUMP ON
# ============================================================

def pump_on():
    # Intentionally disabled: motor is controlled by physical hardware button.
    return False


def pump_off():
    # Intentionally disabled: motor is controlled by physical hardware button.
    return False


# ============================================================
# GPIO CLEANUP
# ============================================================

def cleanup_gpio():
    print("[INFO] No software motor GPIO cleanup required; motor is externally controlled.")


# ============================================================
# SMS ALERT API
# ============================================================

@app.get('/api/alerts/sms/status')
def sms_status():
    return jsonify({
        'configured': sms_is_configured(),
        'cooldownSeconds': SMS_COOLDOWN_SECONDS,
        'motorControl': 'external-physical-button'
    })

@app.post('/api/alerts/sms')
def sms_alert():
    payload = request.get_json(silent=True) or {}
    alert_type = str(payload.get('type', '')).lower()
    try:
        value = float(payload.get('value'))
    except (TypeError, ValueError):
        return jsonify({'sent': False, 'configured': sms_is_configured(), 'message': 'A numeric sensor value is required.'}), 400

    if alert_type == 'soil' and value >= SOIL_MOISTURE_ALERT_THRESHOLD:
        return jsonify({'sent': False, 'configured': sms_is_configured(), 'message': 'Soil moisture is not below the 45% threshold.'})
    if alert_type == 'water' and value >= WATER_LEVEL_ALERT_THRESHOLD:
        return jsonify({'sent': False, 'configured': sms_is_configured(), 'message': 'Water level is not below the 40% threshold.'})
    if alert_type not in ('soil', 'water'):
        return jsonify({'sent': False, 'configured': sms_is_configured(), 'message': 'Alert type must be soil or water.'}), 400
    return jsonify(send_sms_alert(alert_type, value))
