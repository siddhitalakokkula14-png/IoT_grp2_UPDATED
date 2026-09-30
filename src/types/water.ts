export interface WaterTankState {
  currentLevelPercent: number; // 0 - 100
  currentVolumeLiters: number;
  totalCapacityLiters: number;
  status: 'Good' | 'Optimal' | 'Low' | 'Critical';
  estimatedCyclesRemaining: number;
  lastRefillTime?: string;
}

export interface IrrigationSession {
  id: string;
  cropName: string;
  targetSoilMoistureMin: number;
  targetSoilMoistureMax: number;
  currentSoilMoisture: number;
  status: 'Idle' | 'Starting' | 'Active' | 'Completed' | 'Scheduled';
  estimatedDurationMinutes: number;
  elapsedSeconds: number;
  scheduledTime?: string;
}
