import React from 'react';
import { TelemetryPayload } from '../types/agri';
import { CameraCard } from '../components/CameraCard';
import { Camera, Eye, Cpu, ShieldCheck } from 'lucide-react';

interface CameraPageProps {
  telemetry: TelemetryPayload | null;
  isApiOffline: boolean;
}

export const CameraPage: React.FC<CameraPageProps> = ({ telemetry, isApiOffline }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-heading">Raspberry Pi Field Camera Feed</h2>
            <p className="text-xs text-slate-400">
              Live Stream & Snapshot Capture Endpoint (/api/camera/image)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <CameraCard telemetry={telemetry} isApiOffline={isApiOffline} />
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Camera Module Setup Notes
        </h3>
        <p className="text-slate-400 leading-relaxed">
          The Raspberry Pi Camera Module connect via CSI ribbon cable. Images are exposed cleanly via Flask at
          <code className="text-cyan-300 font-mono ml-1">GET /api/camera/image</code>. Browser clients fetch frames on demand without putting continuous hardware strain on the Pi.
        </p>
      </div>
    </div>
  );
};
