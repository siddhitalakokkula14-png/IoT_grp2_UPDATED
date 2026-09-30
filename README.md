# 🌿 Production-Ready Smart Agriculture Monitoring & Irrigation System

A complete, production-ready Smart Agriculture monitoring and automated irrigation web application built with **React**, **TypeScript**, **Tailwind CSS**, and a **Raspberry Pi 4 Flask Hardware Controller**.

> **ZERO SIMULATED TELEMETRY MANDATE:**
> The web application **never** generates fake or random sensor values. If the Raspberry Pi 4 API server is unreachable, the system clearly displays **`OFFLINE`**. If the ADS1115 ADC chip experiences an I2C glitch, the system displays **`SOIL SENSOR UNAVAILABLE`** along with the backend error (e.g. `[Errno 5] Input/output error`).

---

## 📸 System Architecture Overview

```
                      +------------------------------------------+
                      |         Raspberry Pi 4 Controller        |
                      |           Flask Server (Port 5000)       |
                      +--------------------+---------------------+
                                           |
                   +-----------------------+-----------------------+
                   |                       |                       |
        +----------v----------+  +---------v----------+  +---------v----------+
        |   ADS1115 ADC       |  |   5V Relay Module  |  |  Pi Camera Module  |
        |   I2C Addr: 0x48    |  |   GPIO 17 (Pin 11) |  |   CSI / OpenCV     |
        +----------+----------+  +---------+----------+  +--------------------+
                   |                       |
        +----------v----------+  +---------v----------+
        | Capacitive Soil     |  |   DC Water Pump    |
        | Moisture Sensor A0  |  |   (12V / 5V DC)    |
        +---------------------+  +--------------------+
                                           ^
                                           | HTTP JSON Telemetry & Controls
                                           v
                      +------------------------------------------+
                      |         React + Vite Web Application     |
                      |   Configurable VITE_API_BASE_URL         |
                      +------------------------------------------+
```

---

## 🛠️ Hardware Requirements & Wiring Guide

### 1. Raspberry Pi Setup
* **Device:** Raspberry Pi 4 Model B (2GB / 4GB / 8GB)
* **OS:** Raspberry Pi OS 64-bit (Debian Bookworm / Bullseye)
* **Enable I2C:**
  ```bash
  sudo raspi-config nonint do_i2c 0
  sudo reboot
  ```

### 2. ADS1115 16-Bit ADC Wiring (I2C Address `0x48`)
The ADS1115 converts the analog signal from the capacitive soil sensor into a 16-bit digital reading.

| ADS1115 Pin | Raspberry Pi Pin | Description |
| :--- | :--- | :--- |
| **VDD** | Pin 1 (3.3V) or Pin 2 (5V) | Power Supply |
| **GND** | Pin 6 (Ground) | Ground |
| **SCL** | Pin 5 (GPIO 3 / SCL) | I2C Clock |
| **SDA** | Pin 3 (GPIO 2 / SDA) | I2C Data |

Verify detection on I2C bus:
```bash
sudo apt install -y i2c-tools
sudo i2cdetect -y 1
```
*(Address `48` will be highlighted in output grid)*

### 3. Soil Sensor Wiring
* **VCC** -> ADS1115 VDD (or 3.3V)
* **GND** -> ADS1115 GND
* **AOUT (Analog Output)** -> **ADS1115 Channel A0 (AIN0)**

### 4. Relay & DC Water Pump Wiring Notes
* **Relay Module VCC** -> Raspberry Pi Pin 2 (5V)
* **Relay Module GND** -> Raspberry Pi Pin 9 (GND)
* **Relay Module IN (Signal)** -> **Raspberry Pi GPIO 17 (Physical Pin 11)**
* **Pump Circuit:** Wire the positive DC lead of the water pump through the **NO (Normally Open)** and **COM (Common)** relay terminals.
> ⚠️ **SAFETY WARNING:** Use a separate isolated DC power adapter for the water pump. Do not draw pump motor current directly from the Raspberry Pi GPIO or 5V rail to prevent voltage dips or thermal damage.

### 5. Camera Setup
* Connect Raspberry Pi Camera Module to the CSI ribbon cable port.
* Enable camera interface:
  ```bash
  sudo raspi-config nonint do_camera 0
  ```

---

## 🐍 Flask API Server Setup (Raspberry Pi 4)

### 6. Flask Requirements
Navigate to the `raspberry_pi/` directory and install dependencies:
```bash
sudo apt update
sudo apt install -y python3-pip python3-smbus i2c-tools python3-rpi.gpio
pip3 install -r raspberry_pi/requirements.txt
```

### 7. Flask CORS Setup
The Flask application includes explicit cross-origin resource sharing (`flask_cors`) configuration to allow requests from any frontend domain or IP:
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

Run the server on port `5000`:
```bash
python3 raspberry_pi/app.py
```

---

## ⚡ Frontend Web Application Setup

### 8. Frontend Environment Variables
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://10.18.143.248:5000
```
*(Or configure the API URL directly inside the application Settings page at runtime)*

### 9. How to Run Frontend Locally
```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Open browser at `http://localhost:5173`.

### 10. How to Deploy the Frontend
```bash
# Build production bundle
npm run build
```
Deploy the generated `dist/` directory to **Vercel**, **Netlify**, **Nginx**, or **Cloudflare Pages**.

---

## 🌐 Connectivity Options

### 11. Connecting Through LAN IP
1. Find your Raspberry Pi 4 IP address on local Wi-Fi / Ethernet:
   ```bash
   hostname -I
   ```
   *(Example: `192.168.1.100` or `10.18.143.248`)*
2. In the web application Settings page, set **API Base URL** to:
   `http://10.18.143.248:5000`

### 12. Connecting Through Cloudflare Tunnel
For remote internet access without opening router ports:
1. Install `cloudflared` on Raspberry Pi:
   ```bash
   sudo apt install cloudflared
   cloudflared tunnel --url http://localhost:5000
   ```
2. Copy the generated Cloudflare URL (e.g. `https://smart-agri.trycloudflare.com`).
3. Enter this HTTPS URL in the web app Settings page.

---

## 🔍 Troubleshooting Guide

### 13. Troubleshooting API OFFLINE
* **Symptom:** UI displays `"API OFFLINE — unable to receive live data from Raspberry Pi."`
* **Fixes:**
  1. Confirm Flask server is running: `curl http://10.18.143.248:5000/api/status`
  2. Verify firewall allows incoming traffic on TCP port `5000`: `sudo ufw allow 5000`
  3. Ensure frontend and Raspberry Pi are on the same subnet or connected via Cloudflare Tunnel.

### 14. Troubleshooting ADS1115 `[Errno 5] Input/output error`
* **Symptom:** Soil card displays `"SOIL SENSOR UNAVAILABLE — [Errno 5] Input/output error"`
* **Fixes:**
  1. Loose physical I2C connection: Check SDA (Pin 3) & SCL (Pin 5) wiring.
  2. Verify I2C address: Run `sudo i2cdetect -y 1`. If `48` does not appear, replace jumper wires.
  3. Ensure ADS1115 VDD pin has stable 3.3V or 5V power.

### 15. Troubleshooting Camera
* **Symptom:** Camera widget shows `"Camera module offline"`
* **Fixes:**
  1. Re-seat the CSI ribbon cable firmly into the Raspberry Pi camera port.
  2. Verify libcamera detection: `libcamera-hello`

### 16. Troubleshooting Relay / Pump
* **Symptom:** Clicking "START PUMP" does not trigger relay click sound.
* **Fixes:**
  1. Verify relay signal wire is connected to GPIO 17 (Pin 11).
  2. Check relay jumper set to High/Low trigger mode.
  3. Ensure external pump power supply is switched ON.

---

## 📜 API Endpoint Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | Returns hardware handshake, device hostname & I2C status |
| `GET` | `/api/telemetry` | Returns live ADS1115 soil moisture, pump state & camera status |
| `GET` | `/api/camera/latest` | Returns latest camera snapshot metadata |
| `GET` | `/api/camera/image` | Returns live JPEG/SVG image frame from camera |
| `GET` | `/api/pump` | Returns current relay status |
| `POST` | `/api/pump` | Controls relay (`{ "state": "ON" }` or `{ "state": "OFF" }`) |
| `POST` | `/api/auto-irrigation` | Sets automated threshold (`{ "enabled": true, "threshold": 35 }`) |

---

## 🛡️ Security & Zero-Fake Data Guarantee
* Secrets, SSH passwords, and API keys are **never** stored or exposed in client JavaScript.
* The frontend relies strictly on central API calls configured via `VITE_API_BASE_URL`.
* All sensor failures are exposed with transparent hardware error telemetry.


## Updated threshold alerts (September 2026)

This version keeps the existing SmartAgri project structure and adds only the requested changes:

- Soil moisture website alert when live moisture drops **below 45%**.
- Water tank website alert when live water level drops **below 40%**.
- A dashboard notification/toast appears when either value crosses its threshold.
- The System Diagnostic Alerts card also shows the active threshold alert.
- The irrigation motor control is now a compact **slide-style ON/OFF switch** instead of two large buttons.
- Water-level telemetry is read by the Raspberry Pi backend from **ADS1115 address 0x49, channel A0**.
- Soil moisture remains on **ADS1115 address 0x48, channel A0**.
- Existing pages, camera, relay, analytics, settings and other project functionality are preserved.

### Water sensor calibration

The Raspberry Pi backend uses these defaults in `raspberry_pi/app.py`:

- `WATER_EMPTY_VOLTAGE = 0.50` → 0%
- `WATER_FULL_VOLTAGE = 2.80` → 100%

If your physical water-level sensor produces different voltages, change only those two values.

### Quick start on Windows

Open PowerShell in the folder containing `package.json`:

```powershell
npm.cmd install
npm.cmd run dev
```

If PowerShell blocks `npm`, use `npm.cmd` exactly as above.

Run the Raspberry Pi backend from the `raspberry_pi` folder:

```bash
python3 app.py
```

Then set the Raspberry Pi API URL in the website Settings page, for example:

```text
http://192.168.137.240:5000
```

### Important hardware note

The 40% water alert requires a real analog water-level sensor connected to the second ADS1115 at I2C address `0x49`. If that sensor is not physically connected, the website will correctly show the water sensor as unavailable instead of inventing a live water level.


IMPORTANT UPDATED MOTOR SETUP
The motor/pump is disconnected from the software control path. Do not use website buttons or Raspberry Pi API commands to start/stop the motor. The motor is operated only with the physical push button/switch you are adding manually. The website is for soil-moisture and water-level monitoring and alerts only.


## SMS alerts (Twilio)

The website notification and SMS use the same thresholds: soil moisture **below 45%** and water level **below 40%**. Twilio credentials are kept on the Raspberry Pi backend only. The backend enforces the same thresholds and uses a default 10-minute cooldown per alert type to reduce duplicate SMS messages.

### Raspberry Pi SMS setup
1. Install backend packages: `python3 -m pip install -r raspberry_pi/requirements.txt`.
2. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, and `ALERT_PHONE_NUMBER` on the Pi (see `raspberry_pi/.env.example`).
3. Start the Flask backend.
4. Point the website to the Pi API URL, for example `http://192.168.137.240:5000`.

The motor remains external and is controlled only by the physical button/switch; the SMS feature does not control the motor.
