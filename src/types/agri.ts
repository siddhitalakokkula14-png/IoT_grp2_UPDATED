export type ConnectionStatus = 'ONLINE' | 'OFFLINE' | 'CONNECTING';

export type SoilStatus = 'wet' | 'optimal' | 'dry' | 'unavailable';

export type PumpState = 'ON' | 'OFF' | 'unavailable';

export type RelayState = 'active' | 'inactive' | 'unavailable';

export type CameraStatus = 'online' | 'offline' | 'unavailable';

export interface CameraTelemetry {
  status: CameraStatus;
  latestImage: string;
  capturedAt: string;
  error?: string | null;
}

export interface AutoIrrigationConfig {
  enabled: boolean;
  threshold: number;
  lastIrrigatedAt?: string | null;
}

export interface TelemetryPayload {
  device: string;
  hostname?: string;
  status: 'online' | 'offline';
  source: 'live' | 'stale';
  timestamp: string;
  soilStatus: SoilStatus;
  soilMoisture: number | null;
  soilRaw: number | null;
  soilVoltage: number | null;
  adc?: number | null;
  soilError?: string | null;
  waterLevel?: number | null;
  waterStatus?: string | null;
  waterVoltage?: number | null;
  waterRaw?: number | null;
  waterError?: string | null;
  pump: PumpState;
  relay: RelayState;
  camera: CameraTelemetry;
  autoIrrigation?: AutoIrrigationConfig;
}

export interface StatusResponse {
  status: 'online' | 'offline';
  device: string;
  hostname: string;
  timestamp: string;
  version?: string;
  i2c?: {
    ads1115?: string;
  };
  uptime?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  timestamp: string;
  url: string;
  latencyMs?: number;
  data?: StatusResponse | null;
  error?: string | null;
}

export interface SoilReadingHistoryPoint {
  timestamp: string;
  timeFormatted: string;
  moisture: number;
  raw: number;
  voltage: number;
}
