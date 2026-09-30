import React from 'react';
import { TelemetryPayload } from '../types/agri';
import { Power, ToggleRight, Radio, ShieldCheck } from 'lucide-react';

interface IrrigationCardProps {
  telemetry: TelemetryPayload | null;
  isApiOffline: boolean;
}

/**
 * The pump is operated by a PHYSICAL switch/button connected to the hardware.
 * This card is intentionally display-only: there is no clickable web control.
 */
export const IrrigationCard: React.FC<IrrigationCardProps> = ({
  telemetry,
  isApiOffline
}) => {
  const isUnavailable = isApiOffline;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
            <Power className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
              Motor / Pump
            </h3>
            <p className="text-xs text-slate-500">
              External physical switch • No software motor control
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-300 border border-violet-500/30">
          <Radio className="w-3.5 h-3.5" />
          Hardware Control
        </span>
      </div>

      {/* Physical switch illustration — intentionally NOT clickable */}
      <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Manual Motor Button
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              The real button/switch is separate from this website.
            </p>
          </div>
          <ToggleRight className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-14 rounded-full border-2 border-slate-600 bg-slate-800">
            <div className="absolute top-1.5 left-1.5 w-10 h-10 rounded-full bg-slate-500 border border-white/10 shadow-lg" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-wide text-slate-300">
              HARDWARE ONLY
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              No motor command is sent by the website.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 px-3 py-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <span className="text-emerald-300 font-semibold">Disconnected:</span> motor control has been removed from the software. Use your manually installed physical button.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mt-4">
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 block mb-1">Motor Control</span>
          <span className="font-mono text-sm font-bold text-emerald-400">MANUAL</span>
        </div>
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
          <span className="text-slate-400 block mb-1">Website Command</span>
          <span className="font-mono text-sm font-bold text-slate-300">DISABLED</span>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <span className="text-emerald-300 font-semibold">Website monitoring:</span> soil moisture below <b className="text-slate-200">45%</b> and water level below <b className="text-slate-200">40%</b> generate alerts. The website only monitors sensors; the motor is operated by the physical button.
        </p>
      </div>
    </div>
  );
};
