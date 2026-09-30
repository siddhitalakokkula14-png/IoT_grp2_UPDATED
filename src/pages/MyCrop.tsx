import React from 'react';
import { SelectedCropState, CropConfig } from '../types/crop';
import { Sprout, Calendar, ShieldAlert, CheckCircle2, Thermometer, Droplets, RefreshCw } from 'lucide-react';

interface MyCropProps {
  cropConfig: CropConfig;
  selectedCropState: SelectedCropState;
  onUpdateState: (newState: SelectedCropState) => void;
  onOpenCropSelector: () => void;
}

export const MyCrop: React.FC<MyCropProps> = ({
  cropConfig,
  selectedCropState,
  onUpdateState,
  onOpenCropSelector
}) => {
  const stages = ['Seedling', 'Vegetative', 'Flowering', 'Yielding'] as const;

  const handleStageChange = (stage: 'Seedling' | 'Vegetative' | 'Flowering' | 'Yielding') => {
    onUpdateState({
      ...selectedCropState,
      growthStage: stage
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateState({
      ...selectedCropState,
      plantingDate: e.target.value
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Crop Overview Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl shadow-md">
            {cropConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-emerald-400">Crop Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {cropConfig.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive Agronomic Specification & Ideal Field Conditions
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCropSelector}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Change Crop</span>
        </button>
      </div>

      {/* Field Configuration Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Field Lifecycle Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Planting Date */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Planting Date:
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedCropState.plantingDate || ''}
                onChange={handleDateChange}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Growth Stage Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Current Growth Stage:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stages.map((stage) => {
                const isActive = (selectedCropState.growthStage || 'Vegetative') === stage;
                return (
                  <button
                    key={stage}
                    onClick={() => handleStageChange(stage)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ideal Environment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-blue-400" /> Ideal Soil Moisture
          </span>
          <div className="text-2xl font-extrabold text-blue-400">
            {cropConfig.idealSoilMoistureMin}% – {cropConfig.idealSoilMoistureMax}%
          </div>
          <p className="text-[11px] text-slate-400">Maintains root hydration balance</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-amber-400" /> Ideal Temperature
          </span>
          <div className="text-2xl font-extrabold text-amber-400">
            {cropConfig.idealTemperatureMin}°C – {cropConfig.idealTemperatureMax}°C
          </div>
          <p className="text-[11px] text-slate-400">Optimal metabolic photosynthesis</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" /> Ideal Humidity
          </span>
          <div className="text-2xl font-extrabold text-cyan-400">
            {cropConfig.idealHumidityMin}% – {cropConfig.idealHumidityMax}%
          </div>
          <p className="text-[11px] text-slate-400">Atmospheric vapor equilibrium</p>
        </div>
      </div>

      {/* Diseases & Care Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Common Diseases */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Common Crop Vulnerabilities</h2>
          </div>

          <ul className="space-y-2">
            {cropConfig.commonDiseases.map((d, i) => (
              <li key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Basic Recommendations */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Standard Agronomic Care Rules</h2>
          </div>

          <ul className="space-y-2">
            {cropConfig.basicRecommendations.map((r, i) => (
              <li key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
