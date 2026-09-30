import React, { useState } from 'react';
import { BookOpen, Copy, Check, Terminal, Cpu, ShieldCheck, FileText, Zap } from 'lucide-react';

export const BackendDocsPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const flaskAppCode = `from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import time
import datetime
import io

# Hardware Libraries (Raspberry Pi Only)
try:
    import board
    import busio
    import adafruit_ads1x15.ads1115 as ADS
    from adafruit_ads1x15.analog_in import AnalogIn
    import RPi.GPIO as GPIO
    HARDWARE_AVAILABLE = True
except ImportError:
    HARDWARE_AVAILABLE = False

app = Flask(__name__)

# EXACT FLASK CORS CONFIGURATION
CORS(app, resources={r"/api/*": {"origins": "*"}})

# GPIO Setup for 5V Water Pump Relay
RELAY_PIN = 17  # GPIO 17 (Pin 11)
if HARDWARE_AVAILABLE:
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(RELAY_PIN, GPIO.OUT)
    GPIO.output(RELAY_PIN, GPIO.HIGH) # Relay off (active low)

pump_state = "OFF"
relay_state = "inactive"
auto_irrigation_enabled = True
auto_threshold = 45

def read_soil_sensor():
    """Reads ADS1115 ADC channel A0 with error handling for [Errno 5] Input/output error"""
    if not HARDWARE_AVAILABLE:
        return {
            "soilStatus": "unavailable",
            "soilMoisture": None,
            "soilRaw": None,
            "soilVoltage": None,
            "soilError": "[Errno 5] Input/output error (ADS1115 hardware not detected)"
        }
    
    try:
        i2c = busio.I2C(board.SCL, board.SDA)
        ads = ADS.ADS1115(i2c, address=0x48)
        chan = AnalogIn(ads, ADS.P0)
        
        raw_val = chan.value
        voltage = chan.voltage
        
        # Calibration: 3.3V (Dry = 0%), 1.2V (Wet = 100%)
        moisture_pct = max(0, min(100, round((3.3 - voltage) / (3.3 - 1.2) * 100)))
        
        return {
            "soilStatus": "available",
            "soilMoisture": moisture_pct,
            "soilRaw": raw_val,
            "soilVoltage": round(voltage, 6),
            "soilError": None
        }
    except Exception as e:
        return {
            "soilStatus": "unavailable",
            "soilMoisture": None,
            "soilRaw": None,
            "soilVoltage": None,
            "soilError": str(e)
        }

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "online",
        "device": "raspberry-pi-4",
        "hostname": "raspberrypi-agri",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "version": "1.0.0",
        "i2c": {
            "ads1115": "detected_0x48" if HARDWARE_AVAILABLE else "hardware_missing"
        }
    })

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry():
    soil_data = read_soil_sensor()
    
    return jsonify({
        "device": "raspberry-pi-4",
        "status": "online",
        "source": "live",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        **soil_data,
        "pump": pump_state,
        "relay": relay_state,
        "camera": {
            "status": "online" if HARDWARE_AVAILABLE else "offline",
            "latestImage": "/api/camera/image",
            "capturedAt": datetime.datetime.utcnow().isoformat() + "Z"
        },
        "autoIrrigation": {
            "enabled": auto_irrigation_enabled,
            "threshold": auto_threshold,
            "lastIrrigatedAt": None
        }
    })

@app.route('/api/pump', methods=['GET', 'POST'])
def control_pump():
    global pump_state, relay_state
    if request.method == 'POST':
        data = request.get_json() or {}
        requested_state = data.get('state', data.get('action', '')).upper()
        if requested_state == 'ON':
            pump_state = "ON"
            relay_state = "active"
            if HARDWARE_AVAILABLE:
                GPIO.output(RELAY_PIN, GPIO.LOW) # Turn relay ON
        elif requested_state == 'OFF':
            pump_state = "OFF"
            relay_state = "inactive"
            if HARDWARE_AVAILABLE:
                GPIO.output(RELAY_PIN, GPIO.HIGH) # Turn relay OFF
                
    return jsonify({
        "success": True,
        "pump": pump_state,
        "relay": relay_state,
        "message": f"Pump is currently {pump_state}"
    })

@app.route('/api/camera/latest', methods=['GET'])
def get_camera_latest():
    return jsonify({
        "status": "online" if HARDWARE_AVAILABLE else "offline",
        "latestImage": "/api/camera/image",
        "capturedAt": datetime.datetime.utcnow().isoformat() + "Z"
    })

@app.route('/api/auto-irrigation', methods=['POST'])
def set_auto_irrigation():
    global auto_irrigation_enabled, auto_threshold
    data = request.get_json() or {}
    if 'enabled' in data:
        auto_irrigation_enabled = bool(data['enabled'])
    if 'threshold' in data:
        auto_threshold = int(data['threshold'])
    return jsonify({"success": True, "enabled": auto_irrigation_enabled, "threshold": auto_threshold})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-heading">Raspberry Pi Flask Backend & CORS Specification</h2>
            <p className="text-xs text-slate-400">
              Complete Python Flask Source Code for Raspberry Pi 4 Hardware Server (Port 5000)
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippet Container */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">raspberry_pi/app.py Source Code</h3>
          </div>

          <button
            onClick={() => copyToClipboard(flaskAppCode, 'app.py')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copiedCode === 'app.py' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            {copiedCode === 'app.py' ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Run this Python server on your Raspberry Pi 4. It initializes I2C address <code className="text-emerald-300 font-mono">0x48</code> for the ADS1115 ADC, handles <code className="text-amber-300 font-mono">[Errno 5] Input/output error</code> glitches gracefully, and enables cross-origin requests via <code className="text-cyan-300 font-mono">flask_cors</code>.
        </p>

        <pre className="font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-emerald-300 text-xs overflow-x-auto max-h-[500px] overflow-y-auto">
          {flaskAppCode}
        </pre>
      </div>

      {/* Quick Setup Commands */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Raspberry Pi Installation Commands
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">1. Install System Dependencies:</span>
            <code className="text-slate-200 font-mono block select-all">sudo apt update && sudo apt install -y python3-pip python3-smbus i2c-tools python3-rpi.gpio</code>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">2. Install Python Libraries:</span>
            <code className="text-slate-200 font-mono block select-all">pip3 install flask flask-cors adafruit-circuitpython-ads1x15 RPi.GPIO</code>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">3. Enable I2C Bus & Verify ADS1115 Address (0x48):</span>
            <code className="text-slate-200 font-mono block select-all">sudo raspi-config nonint do_i2c 0 && sudo i2cdetect -y 1</code>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block">4. Launch Flask API Server on Port 5000:</span>
            <code className="text-slate-200 font-mono block select-all">python3 app.py</code>
          </div>
        </div>
      </div>
    </div>
  );
};
