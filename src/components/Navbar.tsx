import React from 'react';
import { ConnectionStatus, TelemetryPayload } from '../types/agri';
import { Cpu, Wifi, WifiOff, RefreshCw, LayoutDashboard, Droplets, Power, Camera, Settings, BookOpen, ExternalLink, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  connectionStatus: ConnectionStatus;
  telemetry: TelemetryPayload | null;
  latencyMs: number | null;
  isStale: boolean;
  apiUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  connectionStatus,
  telemetry,
  latencyMs,
  isStale,
  apiUrl
}) => {
  const isSoilOk = telemetry?.soilStatus !== 'unavailable' && telemetry?.soilMoisture !== null;
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 glow-emerald">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight font-heading">
                  SmartAgri
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Production IoT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Flask Hardware Controller • ADS1115 0x48
              </p>
            </div>
          </div>

          {/* Real-time Hardware System Badges */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/50 border border-slate-800/80 rounded-full px-1.5 py-1">
            {/* Raspberry Pi Connection Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/60">
              {connectionStatus === 'ONLINE' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">ONLINE</span>
                  {latencyMs !== null && <span className="text-slate-500 font-mono">({latencyMs}ms)</span>}
                </>
              ) : connectionStatus === 'CONNECTING' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span className="text-amber-400">CONNECTING...</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-red-400">OFFLINE</span>
                </>
              )}
            </div>

            {/* ADS1115 Hardware Sensor Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${connectionStatus === 'OFFLINE'
              ? 'text-slate-500'
              : isSoilOk
                ? 'text-emerald-300'
                : 'text-amber-300'
              }`}>
              <Droplets className="w-3.5 h-3.5" />
              <span>
                {connectionStatus === 'OFFLINE'
                  ? 'ADC: Unknown'
                  : isSoilOk
                    ? 'ADS1115 A0: OK'
                    : 'ADS1115: [Errno 5]'}
              </span>
            </div>

            <span className="w-px h-4 bg-slate-800" />

            {/* Data Freshness Indicator */}
            <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${connectionStatus === 'OFFLINE'
              ? 'text-slate-500'
              : isStale
                ? 'text-amber-400'
                : 'text-emerald-400'
              }`}>
              {connectionStatus === 'OFFLINE' ? 'PAUSED' : isStale ? 'STALE DATA' : 'LIVE TELEMETRY'}
            </div>
          </div>

          {/* Settings Shortcut Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 border-t border-slate-800/60 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 shadow-[inset_0_-2px_0_0_rgba(52,211,153,0.9)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('soil')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'soil'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 shadow-[inset_0_-2px_0_0_rgba(52,211,153,0.9)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Droplets className="w-4 h-4" />
            Soil & ADS1115
          </button>

          <button
            onClick={() => setActiveTab('irrigation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'irrigation'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 shadow-[inset_0_-2px_0_0_rgba(52,211,153,0.9)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Power className="w-4 h-4" />
            Irrigation & Relay
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'camera'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 shadow-[inset_0_-2px_0_0_rgba(52,211,153,0.9)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Camera className="w-4 h-4" />
            Pi Camera
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'settings'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 shadow-[inset_0_-2px_0_0_rgba(52,211,153,0.9)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Settings className="w-4 h-4" />
            Settings & Connection Test
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'docs'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 shadow-[inset_0_-2px_0_0_rgba(52,211,153,0.9)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            Python Backend & Setup Guide
          </button>
        </nav>
      </div>
    </header>
  );
};
