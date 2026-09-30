import { SensorReading, TimeRangeFilter } from '../types/sensor';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Internal Demo State
let currentDemoReading: SensorReading = {
  soilMoisture: 42,
  temperature: 27.4,
  humidity: 63,
  light: 812,
  waterLevel: 68,
  timestamp: new Date().toISOString()
};

let demoModeActive = true;
const listeners: Set<(reading: SensorReading) => void> = new Set();

export const sensorService = {
  isDemoMode(): boolean {
    return demoModeActive;
  },

  setDemoMode(active: boolean) {
    demoModeActive = active;
  },

  subscribe(callback: (reading: SensorReading) => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  notifyListeners() {
    listeners.forEach(cb => cb({ ...currentDemoReading }));
  },

  async getCurrentReadings(): Promise<SensorReading> {
    if (!demoModeActive && API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/sensors/latest`);
        if (res.ok) {
          const data = await res.json();
          return {
            soilMoisture: Number(data.soilMoisture ?? data.soil_moisture ?? 50),
            temperature: Number(data.temperature ?? 25),
            humidity: Number(data.humidity ?? 60),
            light: Number(data.light ?? 800),
            waterLevel: Number(data.waterLevel ?? data.water_level ?? 70),
            timestamp: data.timestamp || new Date().toISOString()
          };
        }
      } catch (err) {
        console.warn('Real API unavailable, falling back to Demo Mode:', err);
      }
    }

    if (isSupabaseConfigured && supabase && !demoModeActive) {
      try {
        const { data, error } = await supabase
          .from('sensor_readings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          return {
            soilMoisture: Number(data.soil_moisture),
            temperature: Number(data.temperature),
            humidity: Number(data.humidity),
            light: Number(data.light),
            waterLevel: Number(data.water_level),
            timestamp: data.created_at
          };
        }
      } catch (e) {
        console.warn('Supabase fetch failed, returning demo reading', e);
      }
    }

    return { ...currentDemoReading, timestamp: new Date().toISOString() };
  },

  async getHistory(timeRange: TimeRangeFilter = '24h'): Promise<SensorReading[]> {
    if (!demoModeActive && API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/sensors/history?range=${timeRange}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Real API history failed, generating simulated history', e);
      }
    }

    // Generate deterministic realistic historical trend graph points
    const pointsCount = timeRange === '24h' ? 24 : timeRange === '7d' ? 28 : 30;
    const history: SensorReading[] = [];
    const now = Date.now();
    const stepMs = (timeRange === '24h' ? 3600 : timeRange === '7d' ? 6 * 3600 : 24 * 3600) * 1000;

    const baseMoisture = currentDemoReading.soilMoisture;
    const baseTemp = currentDemoReading.temperature;
    const baseHum = currentDemoReading.humidity;
    const baseLight = currentDemoReading.light;
    const baseWater = currentDemoReading.waterLevel;

    for (let i = pointsCount - 1; i >= 0; i--) {
      const time = new Date(now - i * stepMs).toISOString();
      const sinVal = Math.sin(i / 3);

      history.push({
        soilMoisture: Math.min(95, Math.max(10, Math.round((baseMoisture + sinVal * 8 - (pointsCount - i) * 0.3) * 10) / 10)),
        temperature: Math.min(45, Math.max(10, Math.round((baseTemp + sinVal * 4) * 10) / 10)),
        humidity: Math.min(95, Math.max(20, Math.round((baseHum - sinVal * 5) * 10) / 10)),
        light: Math.min(1500, Math.max(0, Math.round(baseLight + sinVal * 250))),
        waterLevel: Math.min(100, Math.max(0, Math.round((baseWater + (pointsCount - i) * 0.4) * 10) / 10)),
        timestamp: time
      });
    }

    return history;
  },

  // Demo Simulation Controllers
  updateDemoReading(partial: Partial<SensorReading>) {
    currentDemoReading = { ...currentDemoReading, ...partial, timestamp: new Date().toISOString() };
    this.notifyListeners();
  },

  triggerLowMoisture() {
    this.updateDemoReading({ soilMoisture: 32 });
  },

  triggerLowWater() {
    this.updateDemoReading({ waterLevel: 14 });
  },

  triggerHighTemp() {
    this.updateDemoReading({ temperature: 34.5 });
  },

  resetDemo() {
    currentDemoReading = {
      soilMoisture: 42,
      temperature: 27.4,
      humidity: 63,
      light: 812,
      waterLevel: 68,
      timestamp: new Date().toISOString()
    };
    this.notifyListeners();
  }
};
