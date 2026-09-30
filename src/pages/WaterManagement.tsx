import React from 'react';
import { WaterTankState } from '../types/water';
import { CropConfig } from '../types/crop';
import { SensorReading } from '../types/sensor';
import { WaterTankWidget } from '../components/WaterTankWidget';
import { Droplets, Clock, Play, AlertTriangle, ShieldCheck } from 'lucide-react';

interface WaterManagementProps {
  waterState: WaterTankState;
  cropConfig: CropConfig;
  currentReading: SensorReading;
  isDemoMode: boolean;
  onOpenIrrigationModal: () => void;
}

export const WaterManagement: React.FC<WaterManagementProps> = ({
  waterState,
  cropConfig,
  currentReading,
  isDemoMode,
  onOpenIrrigationModal
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Water & Irrigation Management</h1>
          </div>
          <p className="text-xs text-slate-400">
            Reservoir telemetry and automated pump dispatch control
          </p>
        </div>

        <button
          onClick={onOpenIrrigationModal}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-950/40 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          <span>Launch Irrigation Control</span>
        </button>
      </div>

      {/* Main Reservoir Widget */}
      <WaterTankWidget
        tankState={waterState}
        isDemoMode={isDemoMode}
        onStartIrrigation={onOpenIrrigationModal}
      />

      {/* Irrigation Recommendation Overview Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">Field Irrigation Advisory</h2>
          <span className="text-xs text-slate-400">Crop: <strong className="text-emerald-400">{cropConfig.name}</strong></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Current Soil Moisture</span>
            <p className="text-2xl font-extrabold text-white">{currentReading.soilMoisture}%</p>
            <p className="text-[11px] text-slate-400">Target Range: {cropConfig.idealSoilMoistureMin}–{cropConfig.idealSoilMoistureMax}%</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400">Irrigation Status</span>
            <p className="text-lg font-bold text-amber-300">
              {currentReading.soilMoisture < cropConfig.idealSoilMoistureMin ? 'Irrigation Recommended' : 'Optimal Soil Moisture'}
            </p>
            <p className="text-[11px] text-slate-400">Est. Duration: 25 mins</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-center gap-2">
            <button
              onClick={onOpenIrrigationModal}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-all"
            >
              Start Irrigation Cycle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
