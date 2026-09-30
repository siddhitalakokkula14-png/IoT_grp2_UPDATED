import { Alert } from '../types/alert';
import { CropConfig } from '../types/crop';
import { SensorReading } from '../types/sensor';
import { CameraAnalysisResult } from '../types/camera';

export const SOIL_MOISTURE_ALERT_THRESHOLD = 45;
export const WATER_LEVEL_ALERT_THRESHOLD = 40;

let readAlertIds: Set<string> = new Set();

export const alertService = {
  markAsRead(id: string) {
    readAlertIds.add(id);
  },

  markAllAsRead(alerts: Alert[]) {
    alerts.forEach(a => readAlertIds.add(a.id));
  },

  generateAlerts(
    cropConfig: CropConfig,
    reading: SensorReading,
    cameraAnalysis?: CameraAnalysisResult | null
  ): Alert[] {
    const alerts: Alert[] = [];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (reading.soilMoisture < SOIL_MOISTURE_ALERT_THRESHOLD) {
      alerts.push({
        id: 'alt_moisture_low_45',
        severity: 'critical',
        title: 'Low Soil Moisture',
        message: `Soil moisture is ${reading.soilMoisture}%, below the 45% alert threshold. Irrigation is recommended.`,
        timestamp: now,
        readStatus: readAlertIds.has('alt_moisture_low_45'),
        category: 'Soil'
      });
    }

    if (reading.waterLevel < WATER_LEVEL_ALERT_THRESHOLD) {
      alerts.push({
        id: 'alt_water_low_40',
        severity: 'warning',
        title: 'Low Water Level',
        message: `Water tank level is ${reading.waterLevel}%, below the 40% alert threshold. Please refill the tank.`,
        timestamp: now,
        readStatus: readAlertIds.has('alt_water_low_40'),
        category: 'Water'
      });
    }

    if (reading.temperature > cropConfig.idealTemperatureMax) {
      alerts.push({
        id: 'alt_temp_high',
        severity: 'attention',
        title: 'High Thermal Stress',
        message: `Temperature (${reading.temperature}°C) is above the recommended max range for ${cropConfig.name} (${cropConfig.idealTemperatureMax}°C).`,
        timestamp: now,
        readStatus: readAlertIds.has('alt_temp_high'),
        category: 'Temperature'
      });
    }

    if (cameraAnalysis && cameraAnalysis.possibleDisease) {
      alerts.push({
        id: 'alt_camera_disease',
        severity: 'camera',
        title: 'Leaf Disease Detected',
        message: `Camera scan identified possible ${cameraAnalysis.possibleDisease} with ${cameraAnalysis.confidence}% confidence.`,
        timestamp: now,
        readStatus: readAlertIds.has('alt_camera_disease'),
        category: 'Camera'
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        id: 'alt_healthy',
        severity: 'healthy',
        title: 'Field Conditions Optimal',
        message: `Soil moisture is at/above 45% and water level is at/above 40%. Monitored conditions are currently within the configured alert limits for ${cropConfig.name}.`,
        timestamp: now,
        readStatus: readAlertIds.has('alt_healthy'),
        category: 'System'
      });
    }

    return alerts;
  }
};
