import { CropConfig } from '../types/crop';
import { SensorReading } from '../types/sensor';
import { CameraAnalysisResult } from '../types/camera';

export interface HealthScoreResult {
  score: number;
  status: 'Healthy' | 'Needs Attention' | 'At Risk' | 'Critical';
  breakdown: {
    soilMoistureScore: number;
    temperatureScore: number;
    humidityScore: number;
    waterLevelScore: number;
    cameraHealthScore: number;
  };
  primaryIssue?: string;
}

export function calculateCropHealthScore(
  reading: SensorReading,
  cropConfig: CropConfig,
  cameraAnalysis?: CameraAnalysisResult | null
): HealthScoreResult {
  if (!reading || !cropConfig) {
    return {
      score: 85,
      status: 'Healthy',
      breakdown: {
        soilMoistureScore: 85,
        temperatureScore: 85,
        humidityScore: 85,
        waterLevelScore: 85,
        cameraHealthScore: 100
      }
    };
  }

  // 1. Soil Moisture Score (35%)
  let soilMoistureScore = 100;
  if (reading.soilMoisture < cropConfig.idealSoilMoistureMin) {
    const diff = cropConfig.idealSoilMoistureMin - reading.soilMoisture;
    soilMoistureScore = Math.max(0, 100 - diff * 3.5);
  } else if (reading.soilMoisture > cropConfig.idealSoilMoistureMax) {
    const diff = reading.soilMoisture - cropConfig.idealSoilMoistureMax;
    soilMoistureScore = Math.max(0, 100 - diff * 2.5);
  }

  // 2. Temperature Score (25%)
  let temperatureScore = 100;
  if (reading.temperature < cropConfig.idealTemperatureMin) {
    const diff = cropConfig.idealTemperatureMin - reading.temperature;
    temperatureScore = Math.max(0, 100 - diff * 6);
  } else if (reading.temperature > cropConfig.idealTemperatureMax) {
    const diff = reading.temperature - cropConfig.idealTemperatureMax;
    temperatureScore = Math.max(0, 100 - diff * 6);
  }

  // 3. Humidity Score (15%)
  let humidityScore = 100;
  if (reading.humidity < cropConfig.idealHumidityMin) {
    const diff = cropConfig.idealHumidityMin - reading.humidity;
    humidityScore = Math.max(0, 100 - diff * 3);
  } else if (reading.humidity > cropConfig.idealHumidityMax) {
    const diff = reading.humidity - cropConfig.idealHumidityMax;
    humidityScore = Math.max(0, 100 - diff * 3);
  }

  // 4. Water Level Score (15%)
  let waterLevelScore = 100;
  if (reading.waterLevel < 20) {
    waterLevelScore = Math.max(0, reading.waterLevel * 2.5); // 0-50
  } else if (reading.waterLevel < 40) {
    waterLevelScore = 70;
  }

  // 5. Camera Health Score (10%)
  let cameraHealthScore = 100;
  if (cameraAnalysis) {
    if (cameraAnalysis.condition === 'Critical') cameraHealthScore = 20;
    else if (cameraAnalysis.condition === 'At Risk') cameraHealthScore = 50;
    else if (cameraAnalysis.condition === 'Needs Attention') cameraHealthScore = 75;
    else cameraHealthScore = 100;
  }

  // Weighted combination
  const totalScore = Math.round(
    soilMoistureScore * 0.35 +
    temperatureScore * 0.25 +
    humidityScore * 0.15 +
    waterLevelScore * 0.15 +
    cameraHealthScore * 0.10
  );

  const score = Math.min(100, Math.max(0, totalScore));

  let status: 'Healthy' | 'Needs Attention' | 'At Risk' | 'Critical' = 'Healthy';
  if (score >= 80) status = 'Healthy';
  else if (score >= 60) status = 'Needs Attention';
  else if (score >= 40) status = 'At Risk';
  else status = 'Critical';

  // Primary Issue Identification
  let primaryIssue: string | undefined;
  if (soilMoistureScore < 60) {
    primaryIssue = reading.soilMoisture < cropConfig.idealSoilMoistureMin ? 'Low Soil Moisture' : 'High Soil Moisture';
  } else if (temperatureScore < 60) {
    primaryIssue = reading.temperature > cropConfig.idealTemperatureMax ? 'High Heat Stress' : 'Cold Temperature';
  } else if (waterLevelScore < 50) {
    primaryIssue = 'Low Irrigation Water Tank';
  } else if (cameraHealthScore < 70 && cameraAnalysis?.possibleDisease) {
    primaryIssue = `Leaf Issue: ${cameraAnalysis.possibleDisease}`;
  }

  return {
    score,
    status,
    breakdown: {
      soilMoistureScore: Math.round(soilMoistureScore),
      temperatureScore: Math.round(temperatureScore),
      humidityScore: Math.round(humidityScore),
      waterLevelScore: Math.round(waterLevelScore),
      cameraHealthScore: Math.round(cameraHealthScore)
    },
    primaryIssue
  };
}
