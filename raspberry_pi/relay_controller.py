"""
Relay Controller Module for Raspberry Pi 4 (BCM GPIO 17, Active LOW)
"""

try:
    import RPi.GPIO as GPIO
    HARDWARE_AVAILABLE = True
except (ImportError, RuntimeError):
    HARDWARE_AVAILABLE = False
    GPIO = None

RELAY_PIN = 17  # BCM GPIO 17

def initialize_relay():
    """Initializes GPIO 17 as output and sets relay to OFF (HIGH)."""
    if HARDWARE_AVAILABLE and GPIO is not None:
        try:
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(RELAY_PIN, GPIO.OUT)
            # Active LOW relay: HIGH = OFF, LOW = ON
            GPIO.output(RELAY_PIN, GPIO.HIGH)
        except Exception as e:
            print(f"[ERROR] initialize_relay failed: {e}")

def pump_on():
    """Turns the physical pump relay ON (active LOW -> GPIO LOW)."""
    if HARDWARE_AVAILABLE and GPIO is not None:
        try:
            GPIO.output(RELAY_PIN, GPIO.LOW)
        except Exception as e:
            print(f"[ERROR] pump_on failed: {e}")

def pump_off():
    """Turns the physical pump relay OFF (active LOW -> GPIO HIGH)."""
    if HARDWARE_AVAILABLE and GPIO is not None:
        try:
            GPIO.output(RELAY_PIN, GPIO.HIGH)
        except Exception as e:
            print(f"[ERROR] pump_off failed: {e}")

def cleanup_relay():
    """Cleans up GPIO resources."""
    if HARDWARE_AVAILABLE and GPIO is not None:
        try:
            GPIO.cleanup()
        except Exception as e:
            print(f"[ERROR] cleanup_relay failed: {e}")
