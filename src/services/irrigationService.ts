import { IrrigationSession } from '../types/water';
import { CropConfig } from '../types/crop';
import { SensorReading } from '../types/sensor';
import { sensorService } from './sensorService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let activeSession: IrrigationSession | null = null;
let intervalId: any = null;
const sessionListeners: Set<(session: IrrigationSession | null) => void> = new Set();

export const irrigationService = {
  subscribe(callback: (session: IrrigationSession | null) => void) {
    sessionListeners.add(callback);
    callback(activeSession);
    return () => sessionListeners.delete(callback);
  },

  notify() {
    sessionListeners.forEach(cb => cb(activeSession ? { ...activeSession } : null));
  },

  async startIrrigation(cropConfig: CropConfig, currentReading: SensorReading): Promise<{ success: boolean; message: string }> {
    if (activeSession && activeSession.status === 'Active') {
      return { success: false, message: 'Irrigation is already running.' };
    }

    if (!sensorService.isDemoMode() && API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/irrigation/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crop: cropConfig.name, currentMoisture: currentReading.soilMoisture })
        });
        if (res.ok) {
          return { success: true, message: 'Hardware Irrigation Pump activated via Raspberry Pi.' };
        }
      } catch (err) {
        console.warn('Raspberry Pi API trigger failed, falling back to Demo Mode simulation:', err);
      }
    }

    // Demo Mode Irrigation Simulation
    const targetMoisture = Math.round((cropConfig.idealSoilMoistureMin + cropConfig.idealSoilMoistureMax) / 2);
    const deficit = Math.max(5, targetMoisture - currentReading.soilMoisture);
    const durationMinutes = Math.min(45, Math.max(10, Math.round(deficit * 1.5)));

    activeSession = {
      id: 'irr_' + Date.now(),
      cropName: cropConfig.name,
      targetSoilMoistureMin: cropConfig.idealSoilMoistureMin,
      targetSoilMoistureMax: cropConfig.idealSoilMoistureMax,
      currentSoilMoisture: currentReading.soilMoisture,
      status: 'Active',
      estimatedDurationMinutes: durationMinutes,
      elapsedSeconds: 0
    };

    this.notify();

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      if (!activeSession) return;

      activeSession.elapsedSeconds += 2;
      
      // Increment moisture gradually in demo mode
      const progress = activeSession.elapsedSeconds / (activeSession.estimatedDurationMinutes * 60);
      const newMoisture = Math.min(
        activeSession.targetSoilMoistureMax,
        Math.round((currentReading.soilMoisture + deficit * Math.min(1, progress * 4)) * 10) / 10
      );

      activeSession.currentSoilMoisture = newMoisture;
      sensorService.updateDemoReading({
        soilMoisture: newMoisture,
        waterLevel: Math.max(5, currentReading.waterLevel - 0.15)
      });

      if (progress >= 1 || newMoisture >= targetMoisture) {
        activeSession.status = 'Completed';
        this.notify();
        clearInterval(intervalId);
        setTimeout(() => {
          activeSession = null;
          this.notify();
        }, 5000);
      } else {
        this.notify();
      }
    }, 1000);

    return {
      success: true,
      message: 'Irrigation started in Demo Mode. Hydrating field sensors...'
    };
  },

  async stopIrrigation(): Promise<{ success: boolean; message: string }> {
    if (intervalId) clearInterval(intervalId);

    if (!sensorService.isDemoMode() && API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/api/irrigation/stop`, { method: 'POST' });
      } catch (e) {
        console.warn('Failed to call API stop endpoint', e);
      }
    }

    if (activeSession) {
      activeSession.status = 'Completed';
      this.notify();
      setTimeout(() => {
        activeSession = null;
        this.notify();
      }, 2000);
    }

    return { success: true, message: 'Irrigation stopped.' };
  },

  getActiveSession(): IrrigationSession | null {
    return activeSession;
  }
};
