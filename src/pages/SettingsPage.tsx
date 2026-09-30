import React, { useState } from 'react';
import { ConnectionStatus, ConnectionTestResult, TelemetryPayload } from '../types/agri';
import { apiService } from '../services/apiService';
import { Settings, Network, RefreshCw, CheckCircle2, AlertTriangle, Save, RotateCcw, Sliders, ShieldCheck, Terminal, Cpu } from 'lucide-react';

interface SettingsPageProps {
  currentApiUrl: string;
  connectionStatus: ConnectionStatus;
  pollingInterval: number;
  setPollingInterval: (interval: number) => void;
  onUpdateApiUrl: (newUrl: string) => void;
  telemetry: TelemetryPayload | null;
  lastUpdated: Date | null;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentApiUrl,
  connectionStatus,
  pollingInterval,
  setPollingInterval,
  onUpdateApiUrl,
  telemetry,
  lastUpdated
}) => {
  const [inputUrl, setInputUrl] = useState(currentApiUrl);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await apiService.getStatus(inputUrl);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        timestamp: new Date().toISOString(),
        url: inputUrl,
        error: err.message || 'Fetch failed'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveUrl = () => {
    const saved = apiService.setApiBaseUrl(inputUrl);
    onUpdateApiUrl(saved);
    setSaveNotification(`API Base URL saved: ${saved}`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleResetUrl = () => {
    const defaultUrl = apiService.resetApiBaseUrl();
    setInputUrl(defaultUrl);
    onUpdateApiUrl(defaultUrl);
    setSaveNotification(`Reset to default: ${defaultUrl}`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-heading">Settings & Hardware Diagnostics</h2>
            <p className="text-xs text-slate-400">
              Configure Central Raspberry Pi API Base URL, Polling Intervals & Run Live Handshake Tests
            </p>
          </div>
        </div>
      </div>

      {/* Save Toast Notification */}
      {saveNotification && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 glow-emerald">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {saveNotification}
        </div>
      )}

      {/* 1. API Base URL Configuration Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Network className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Central Raspberry Pi API Base URL</h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            VITE_API_BASE_URL
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Specify the network origin for the Raspberry Pi 4 Flask backend server running on port 5000.
          Can be a local IP address (e.g. <code className="text-emerald-300 font-mono">http://10.18.143.248:5000</code>), LAN IP, or Cloudflare Tunnel URL.
        </p>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Target API Endpoint Host:</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="http://10.18.143.248:5000"
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl text-slate-100 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveUrl}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 glow-emerald shadow-lg"
              >
                <Save className="w-4 h-4" />
                Save URL
              </button>
              <button
                onClick={handleResetUrl}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
                title="Reset to environment default"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Quick Presets:</span>
            <button
              onClick={() => setInputUrl('http://10.18.143.248:5000')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px]"
            >
              http://10.18.143.248:5000
            </button>
            <button
              onClick={() => setInputUrl('http://192.168.1.100:5000')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px]"
            >
              http://192.168.1.100:5000
            </button>
            <button
              onClick={() => setInputUrl('http://localhost:5000')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px]"
            >
              http://localhost:5000
            </button>
          </div>
        </div>

        {/* Live Handshake Connection Test Box */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-200">Hardware Connection Handshake Test</h4>
              <p className="text-xs text-slate-400">Tests endpoint <code className="text-emerald-300 font-mono">GET {inputUrl}/api/status</code></p>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg glow-cyan disabled:opacity-50"
            >
              {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
              {isTesting ? 'Testing Endpoint...' : 'Test Connection'}
            </button>
          </div>

          {/* Test Result Display Window */}
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-red-500/10 border-red-500/30 text-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {testResult.success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400">Raspberry Pi API connected</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400">Unable to connect to Raspberry Pi API</span>
                    </>
                  )}
                </div>

                {testResult.latencyMs !== undefined && (
                  <span className="font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
                    Latency: {testResult.latencyMs} ms
                  </span>
                )}
              </div>

              {testResult.error && (
                <div className="font-mono bg-slate-950 p-2.5 rounded-lg border border-red-500/20 text-red-300 text-[11px] overflow-x-auto">
                  {testResult.error}
                </div>
              )}

              {testResult.data && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-[11px] font-semibold block">Flask Response Data:</span>
                  <pre className="font-mono bg-slate-950 p-3 rounded-lg border border-emerald-500/20 text-emerald-300 text-[11px] overflow-x-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Polling Interval & Performance Settings */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-slate-100">Telemetry Polling Interval</h3>
        </div>

        <p className="text-xs text-slate-400">
          Controls how frequently the frontend polls <code className="text-emerald-300 font-mono">/api/telemetry</code> for live ADS1115 soil moisture and relay states.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[2, 3, 5, 10].map((sec) => (
            <button
              key={sec}
              onClick={() => setPollingInterval(sec * 1000)}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                pollingInterval === sec * 1000
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 glow-purple'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-base font-extrabold">{sec}s</span>
              <span className="text-[10px] opacity-75">{sec === 3 ? '(Recommended)' : 'Interval'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. System Hardware Summary Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">Raspberry Pi 4 Hardware Configuration</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block text-[11px]">ADC Converter</span>
            <span className="font-semibold text-slate-200 font-mono">ADS1115 (16-Bit) @ I2C 0x48</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block text-[11px]">Soil Moisture Pin</span>
            <span className="font-semibold text-slate-200 font-mono">Channel A0 (0V to 3.3V Analog)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block text-[11px]">Irrigation Pump Relay</span>
            <span className="font-semibold text-slate-200 font-mono">5V Relay Module @ GPIO 17</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block text-[11px]">Field Camera</span>
            <span className="font-semibold text-slate-200 font-mono">PiCamera / OpenCV Frame Endpoint</span>
          </div>
        </div>
      </div>
    </div>
  );
};
