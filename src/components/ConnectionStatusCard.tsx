import React from 'react';
import { ConnectionStatus, TelemetryPayload } from '../types/agri';
import { Wifi, WifiOff, RefreshCw, Cpu, Clock, Activity, ExternalLink } from 'lucide-react';

interface ConnectionStatusCardProps {
  connectionStatus: ConnectionStatus;
  telemetry: TelemetryPayload | null;
  latencyMs: number | null;
  apiUrl: string;
  lastUpdated: Date | null;
  isStale: boolean;
  errorMessage: string | null;
  onOpenSettings: () => void;
  onManualRefresh: () => void;
}

export const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({
  connectionStatus,
  telemetry,
  latencyMs,
  apiUrl,
  lastUpdated,
  isStale,
  errorMessage,
  onOpenSettings,
  onManualRefresh
}) => {
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 glow-emerald">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        );
      case 'CONNECTING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 glow-amber">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            CONNECTING...
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 glow-red">
            <WifiOff className="w-3.5 h-3.5" />
            OFFLINE
          </span>
        );
    }
  };

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Never';

  const secondsAgo = lastUpdated
    ? Math.max(0, Math.floor((Date.now() - lastUpdated.getTime()) / 1000))
    : null;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
      {/* Background Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-10 ${
        connectionStatus === 'ONLINE' ? 'bg-emerald-500/10' : 'bg-red-500/10'
      }`} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Controller Unit</h3>
              <p className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                {telemetry?.device || telemetry?.hostname || 'Raspberry Pi 4'}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Dynamic Warning Banner if Offline */}
        {connectionStatus === 'OFFLINE' && (
          <div className="status-banner status-banner-critical mb-4 text-xs flex items-start gap-2">
            <WifiOff className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-slate-200">Unable to reach Raspberry Pi</span>
              <span className="text-slate-400">{errorMessage || `Could not connect to ${apiUrl}`}</span>
            </div>
          </div>
        )}

        {/* Dynamic Warning Banner if Stale */}
        {connectionStatus === 'ONLINE' && isStale && (
          <div className="status-banner status-banner-warning mb-4 text-xs flex items-start gap-2">
            <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-slate-200">Stale telemetry detected</span>
              <span className="text-slate-400">No telemetry response received in the last {secondsAgo} seconds.</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">API Base URL</span>
            <span className="font-mono text-slate-200 truncate block text-[11px]" title={apiUrl}>
              {apiUrl}
            </span>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Network Latency</span>
            <span className="font-semibold text-emerald-400">
              {latencyMs !== null ? `${latencyMs} ms` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Last Updated: <strong className="text-slate-200">{formattedTime}</strong></span>
          {secondsAgo !== null && <span className="text-slate-500">({secondsAgo}s ago)</span>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onManualRefresh}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh connection now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors text-xs"
          >
            <span>Settings</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
