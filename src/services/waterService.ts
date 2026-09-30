import { WaterTankState } from '../types/water';
import { SensorReading } from '../types/sensor';

const TOTAL_CAPACITY_LITERS = 1000;
const LITERS_PER_IRRIGATION_CYCLE = 200;

export const waterService = {
  getWaterTankState(reading: SensorReading): WaterTankState {
    const percent = Math.min(100, Math.max(0, Math.round(reading.waterLevel)));
    const volume = Math.round((percent / 100) * TOTAL_CAPACITY_LITERS);

    let status: 'Good' | 'Optimal' | 'Low' | 'Critical' = 'Good';
    if (percent >= 70) status = 'Optimal';
    else if (percent >= 40) status = 'Good';
    else if (percent >= 20) status = 'Low';
    else status = 'Critical';

    const cycles = Math.floor(volume / LITERS_PER_IRRIGATION_CYCLE);

    return {
      currentLevelPercent: percent,
      currentVolumeLiters: volume,
      totalCapacityLiters: TOTAL_CAPACITY_LITERS,
      status,
      estimatedCyclesRemaining: cycles,
      lastRefillTime: new Date(Date.now() - 48 * 3600 * 1000).toLocaleDateString()
    };
  }
};
