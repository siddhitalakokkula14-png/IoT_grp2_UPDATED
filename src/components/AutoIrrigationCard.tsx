import React from 'react';
import { TelemetryPayload } from '../types/agri';
import { ShieldCheck, Bell, Sprout, Droplets } from 'lucide-react';

interface AutoIrrigationCardProps {
  telemetry: TelemetryPayload | null;
  isApiOffline: boolean;
  onRefresh: () => void;
}

export const AutoIrrigationCard: React.FC<AutoIrrigationCardProps> = ({ telemetry, isApiOffline }) => {
  const soil = telemetry?.soilMoisture;
  const water = telemetry?.waterLevel;
  const soilLow = soil !== null && soil !== undefined && soil < 45;
  const waterLow = water !== null && water !== undefined && water < 40;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Manual Irrigation Mode</h3>
            <p className="text-xs text-slate-500">Motor control is external hardware</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">MANUAL</span>
      </div>

      <div className="space-y-3">
        <div className={`p-3 rounded-xl border ${soilLow ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-slate-300"><Sprout className="w-4 h-4 text-emerald-400" /> Soil moisture</span>
            <strong className={soilLow ? 'text-rose-300' : 'text-slate-200'}>{soil == null ? '--' : `${soil}%`}</strong>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Alert when below 45%</p>
        </div>
        <div className={`p-3 rounded-xl border ${waterLow ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-slate-300"><Droplets className="w-4 h-4 text-cyan-400" /> Water level</span>
            <strong className={waterLow ? 'text-amber-300' : 'text-slate-200'}>{water == null ? '--' : `${water}%`}</strong>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Alert when below 40%</p>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-[11px] text-slate-400 leading-relaxed">
        <Bell className="w-3.5 h-3.5 text-blue-400 inline mr-1" />
        These alerts notify the operator. They do <strong className="text-slate-200">not</strong> start or stop the motor automatically.
      </div>
    </div>
  );
};
