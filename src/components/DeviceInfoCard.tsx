import React from 'react';
import { TelemetryPayload, StatusResponse } from '../types/agri';
import { Server, HardDrive, Cpu, Radio, Network, CheckCircle } from 'lucide-react';

interface DeviceInfoCardProps {
  telemetry: TelemetryPayload | null;
  statusInfo: StatusResponse | null;
  apiUrl: string;
  latencyMs: number | null;
  isApiOffline: boolean;
}

export const DeviceInfoCard: React.FC<DeviceInfoCardProps> = ({
  telemetry,
  statusInfo,
  apiUrl,
  latencyMs,
  isApiOffline
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Device Hardware</h3>
              <p className="text-xs text-slate-500">Raspberry Pi Specs & API Node</p>
            </div>
          </div>

          <span className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            BCM2711 Quad-Core
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-0.5">Hostname / Device</span>
            <span className="font-semibold text-slate-200 font-mono">
              {telemetry?.device || statusInfo?.hostname || 'raspberry-pi-4'}
            </span>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-0.5">API Server Port</span>
            <span className="font-semibold text-slate-200 font-mono">
              Flask / 5000
            </span>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-0.5">I2C Sensor Bus</span>
            <span className="font-semibold text-emerald-400 font-mono">
              {statusInfo?.i2c?.ads1115 || 'ADS1115 @ 0x48'}
            </span>
          </div>

          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px] mb-0.5">Ping Latency</span>
            <span className="font-semibold text-cyan-400 font-mono">
              {latencyMs !== null ? `${latencyMs} ms` : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 truncate max-w-[220px]">
          <Network className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-[11px]">{apiUrl}</span>
        </span>

        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
          isApiOffline ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
        }`}>
          {isApiOffline ? 'Unreachable' : 'Connected'}
        </span>
      </div>
    </div>
  );
};
