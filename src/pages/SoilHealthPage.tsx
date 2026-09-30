import React from 'react';
import { TelemetryPayload } from '../types/agri';
import { SoilMoistureCard } from '../components/SoilMoistureCard';
import { SoilHistoryChart } from '../components/SoilHistoryChart';
import { SoilReadingHistoryPoint } from '../types/agri';
import { Droplets, Cpu, AlertTriangle, Hash, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SoilHealthPageProps {
  telemetry: TelemetryPayload | null;
  isApiOffline: boolean;
  history: SoilReadingHistoryPoint[];
}

export const SoilHealthPage: React.FC<SoilHealthPageProps> = ({ telemetry, isApiOffline, history }) => {
  const isUnavailable = isApiOffline || !telemetry || telemetry.soilStatus === 'unavailable' || telemetry.soilMoisture === null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-heading">Soil Moisture & ADS1115 Hardware Diagnostics</h2>
            <p className="text-xs text-slate-400">
              16-Bit ADS1115 ADC (I2C Address 0x48) • Capacitive Soil Moisture Sensor (Channel A0)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SoilMoistureCard telemetry={telemetry} isApiOffline={isApiOffline} />

        {/* Detailed Hardware Technical Parameters Box */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            ADS1115 ADC Technical Specification
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">I2C Address</span>
              <span className="font-mono font-bold text-emerald-400">0x48 (Detected)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">ADC Resolution</span>
              <span className="font-mono font-bold text-slate-200">16-Bit Differential / Single-Ended</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Active Channel</span>
              <span className="font-mono font-bold text-slate-200">Channel A0 (AIN0)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Voltage Input Range</span>
              <span className="font-mono font-bold text-cyan-400">0.0V – 3.3V DC</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Dry Soil Reference</span>
              <span className="font-mono font-bold text-slate-300">~3.30 Volts (ADC ~26400)</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Wet Soil Reference</span>
              <span className="font-mono font-bold text-slate-300">~1.20 Volts (ADC ~9600)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Guide if Sensor Failed */}
      {isUnavailable && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Troubleshooting ADS1115 [Errno 5] Input/output error
          </div>
          <p className="leading-relaxed">
            An I2C bus read error occurs when the Raspberry Pi OS kernel cannot communicate with the ADS1115 chip at address 0x48.
          </p>
          <ul className="list-disc list-inside space-y-1.5 font-mono text-[11px] bg-slate-950 p-3.5 rounded-xl border border-amber-500/20 text-amber-300">
            <li>1. Check VCC wire connected to Raspberry Pi Pin 1 (3.3V) or Pin 2 (5V).</li>
            <li>2. Verify SDA is wired to GPIO 2 (Pin 3) and SCL to GPIO 3 (Pin 5).</li>
            <li>3. Confirm GND wire is attached to Pi Pin 6 or 9.</li>
            <li>4. Run <code className="text-white bg-slate-900 px-1 py-0.5 rounded">sudo i2cdetect -y 1</code> on Raspberry Pi terminal to confirm 0x48 appears.</li>
          </ul>
        </div>
      )}

      {/* Live Chart */}
      <SoilHistoryChart history={history} isApiOffline={isApiOffline} />
    </div>
  );
};
