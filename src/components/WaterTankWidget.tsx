import React from 'react';
import { WaterTankState } from '../types/water';
import { Droplets, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface WaterTankWidgetProps {
  tankState: WaterTankState;
  isDemoMode: boolean;
  onStartIrrigation?: () => void;
}

export const WaterTankWidget: React.FC<WaterTankWidgetProps> = ({
  tankState,
  isDemoMode,
  onStartIrrigation
}) => {
  const { currentLevelPercent, currentVolumeLiters, totalCapacityLiters, status, estimatedCyclesRemaining } = tankState;

  let statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (status === 'Low') statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (status === 'Critical') statusBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/30';

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Water Tank Level</h3>
              {isDemoMode && (
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
                  Simulated Data
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">Main Irrigation Reservoir Monitoring</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge}`}>
          Status: {status}
        </span>
      </div>

      {/* Visual Water Level Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Tank Graphic */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80">
          <div className="w-24 h-36 bg-slate-900 border-2 border-slate-700 rounded-xl relative overflow-hidden flex flex-col justify-end p-1 shadow-inner">
            <div
              className="w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 rounded-lg transition-all duration-1000 relative shadow-lg shadow-cyan-500/30"
              style={{ height: `${currentLevelPercent}%` }}
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-white/40 animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-white drop-shadow-md">
                {currentLevelPercent}%
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 mt-2 font-medium">Reservoir Sensor #1</span>
        </div>

        {/* Tank Metrics Details */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-xs text-slate-400">Current Storage Volume</span>
              <div className="text-2xl font-extrabold text-white">
                {currentVolumeLiters} <span className="text-sm text-slate-400">/ {totalCapacityLiters} L</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Capacity</span>
              <p className="text-sm font-semibold text-emerald-400">1,000 Liters</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-300">Estimated Irrigation Capacity:</span>
            <p className="text-sm font-extrabold text-cyan-300">
              Approximately {estimatedCyclesRemaining}–{estimatedCyclesRemaining + 1} irrigation cycles remaining.
            </p>
            <p className="text-[11px] text-slate-400">
              Calculated based on standard 200L per hydration cycle.
            </p>
          </div>

          {onStartIrrigation && (
            <button
              onClick={onStartIrrigation}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-950/50 flex items-center justify-center gap-2"
            >
              <Droplets className="w-4 h-4" />
              <span>Open Irrigation Controller</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
