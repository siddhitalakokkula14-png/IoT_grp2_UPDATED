export interface SensorReading {
  soilMoisture: number; // %
  temperature: number;  // °C
  humidity: number;     // %
  light: number;        // lux
  waterLevel: number;   // %
  timestamp: string;    // ISO date string
}

export interface MetricTrend {
  value: number;
  change: number; // percentage change or delta
  status: 'optimal' | 'warning' | 'critical' | 'low' | 'high';
  statusText: string;
}

export type TimeRangeFilter = '24h' | '7d' | '30d';
