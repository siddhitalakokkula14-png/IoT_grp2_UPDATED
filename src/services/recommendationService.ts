import { Recommendation } from '../types/recommendation';
import { CropConfig } from '../types/crop';
import { SensorReading } from '../types/sensor';
import { CameraAnalysisResult } from '../types/camera';

export const recommendationService = {
  generateRecommendations(
    cropConfig: CropConfig,
    reading: SensorReading,
    cameraAnalysis?: CameraAnalysisResult | null
  ): Recommendation[] {
    const list: Recommendation[] = [];
    const now = new Date().toISOString();

    // 1. Soil Moisture Checks
    if (reading.soilMoisture < cropConfig.idealSoilMoistureMin) {
      const isCritical = reading.soilMoisture < cropConfig.idealSoilMoistureMin - 15;
      list.push({
        id: 'rec_moist_low',
        category: 'water',
        title: isCritical ? 'Critical Soil Drought' : 'Irrigation Recommended',
        description: `Your soil moisture is ${reading.soilMoisture}%, which is below the ideal range of ${cropConfig.idealSoilMoistureMin}–${cropConfig.idealSoilMoistureMax}% for ${cropConfig.name}.`,
        priority: isCritical ? 'critical' : 'medium',
        action: 'Irrigate the field immediately.',
        currentValue: `${reading.soilMoisture}%`,
        idealValue: `${cropConfig.idealSoilMoistureMin}–${cropConfig.idealSoilMoistureMax}%`,
        whyItMatters: `Water deficiency during active growth inhibits crop nutrient uptake and stunt yields. ${cropConfig.irrigationGuidance}`,
        createdAt: now
      });
    } else if (reading.soilMoisture > cropConfig.idealSoilMoistureMax) {
      list.push({
        id: 'rec_moist_high',
        category: 'soil',
        title: 'Excess Soil Moisture',
        description: `Soil moisture (${reading.soilMoisture}%) is above the max recommended limit of ${cropConfig.idealSoilMoistureMax}% for ${cropConfig.name}.`,
        priority: 'medium',
        action: 'Pause irrigation and check drainage ditches.',
        currentValue: `${reading.soilMoisture}%`,
        idealValue: `${cropConfig.idealSoilMoistureMin}–${cropConfig.idealSoilMoistureMax}%`,
        whyItMatters: 'Waterlogged soil reduces root zone oxygen levels and increases bacterial rot vulnerability.',
        createdAt: now
      });
    }

    // 2. Water Tank Level Checks
    if (reading.waterLevel < 40) {
      list.push({
        id: 'rec_water_low',
        category: 'water',
        title: 'Water Tank Low',
        description: `Your irrigation water tank level is at ${reading.waterLevel}%. Refill it before the next irrigation cycle.`,
        priority: 'high',
        action: 'Refill water supply tank.',
        currentValue: `${reading.waterLevel}%`,
        idealValue: '40–100%',
        whyItMatters: 'Insufficient tank capacity may interrupt scheduled automated irrigation.',
        createdAt: now
      });
    }

    // 3. Temperature Checks
    if (reading.temperature > cropConfig.idealTemperatureMax) {
      list.push({
        id: 'rec_temp_high',
        category: 'temperature',
        title: 'Temperature is High',
        description: `Current ambient temperature (${reading.temperature}°C) is above the preferred range of ${cropConfig.idealTemperatureMin}–${cropConfig.idealTemperatureMax}°C for ${cropConfig.name}.`,
        priority: 'medium',
        action: 'Monitor crop closely and ensure sufficient moisture.',
        currentValue: `${reading.temperature}°C`,
        idealValue: `${cropConfig.idealTemperatureMin}–${cropConfig.idealTemperatureMax}°C`,
        whyItMatters: 'High heat stress accelerates transpiration and may cause flower/fruit drop.',
        createdAt: now
      });
    } else if (reading.temperature < cropConfig.idealTemperatureMin) {
      list.push({
        id: 'rec_temp_low',
        category: 'temperature',
        title: 'Temperature is Low',
        description: `Temperature (${reading.temperature}°C) is lower than preferred ideal (${cropConfig.idealTemperatureMin}°C).`,
        priority: 'low',
        action: 'Consider protective row covers or thermal soil mulching.',
        currentValue: `${reading.temperature}°C`,
        idealValue: `${cropConfig.idealTemperatureMin}–${cropConfig.idealTemperatureMax}°C`,
        whyItMatters: 'Low temperatures slow plant metabolic rate and extend harvest cycles.',
        createdAt: now
      });
    }

    // 4. Camera Analysis Disease Checks
    if (cameraAnalysis && cameraAnalysis.possibleDisease) {
      list.push({
        id: 'rec_disease_cam',
        category: 'disease',
        title: `Possible Disease: ${cameraAnalysis.possibleDisease}`,
        description: `Camera analysis identified potential leaf anomalies with ${cameraAnalysis.confidence}% confidence.`,
        priority: cameraAnalysis.severity === 'Severe' ? 'critical' : 'high',
        action: cameraAnalysis.recommendations[0] || 'Inspect affected foliage.',
        currentValue: `${cameraAnalysis.confidence}% Match`,
        idealValue: 'Healthy Foliage',
        whyItMatters: `Early localized treatment prevents rapid pathogen spread across ${cropConfig.name} acreage.`,
        createdAt: now
      });
    }

    // 5. Default General Crop Care Recommendation
    if (list.length === 0) {
      list.push({
        id: 'rec_general_healthy',
        category: 'crop-health',
        title: 'Optimal Growth Conditions',
        description: `All monitored sensors are currently within ideal parameters for ${cropConfig.name}.`,
        priority: 'low',
        action: 'Maintain existing irrigation and fertilizer schedule.',
        currentValue: 'Optimal',
        idealValue: 'Optimal',
        whyItMatters: 'Balanced soil, thermal, and hydrologic conditions optimize yield quality.',
        createdAt: now
      });
    }

    // Sort by priority (critical -> high -> medium -> low)
    const priorityWeight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    return list.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  }
};
