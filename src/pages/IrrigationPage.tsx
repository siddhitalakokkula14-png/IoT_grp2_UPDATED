import React from 'react';
import { TelemetryPayload } from '../types/agri';
import { IrrigationCard } from '../components/IrrigationCard';
import { AutoIrrigationCard } from '../components/AutoIrrigationCard';
import { Power, Sliders, ShieldAlert, Zap, CheckCircle2 } from 'lucide-react';

interface IrrigationPageProps {
  telemetry: TelemetryPayload | null;
  isApiOffline: boolean;
  onRefresh: () => void;
}

export const IrrigationPage: React.FC<IrrigationPageProps> = ({
  telemetry,
  isApiOffline,
  onRefresh
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Power className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-heading">Motor Status & Irrigation Monitoring</h2>
            <p className="text-xs text-slate-400">
              Manual hardware switch • Motor is controlled outside the website
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <IrrigationCard
          telemetry={telemetry}
          isApiOffline={isApiOffline}
        />

        <AutoIrrigationCard
          telemetry={telemetry}
          isApiOffline={isApiOffline}
          onRefresh={onRefresh}
        />
      </div>

      {/* Manual hardware note */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
          Motor Control Removed from Software
        </h3>
        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            The motor is <strong className="text-emerald-300">not controlled by this website or Raspberry Pi software</strong>.
            Use the physical push button/switch you are adding manually to turn the motor ON or OFF.
            This dashboard only monitors soil moisture and water level and displays alerts.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 font-semibold block">Soil alert</span>
            <span className="text-rose-300 font-bold">Below 45%</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 font-semibold block">Water alert</span>
            <span className="text-amber-300 font-bold">Below 40%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
