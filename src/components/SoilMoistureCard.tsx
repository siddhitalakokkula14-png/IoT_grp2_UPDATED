import React from 'react';
import { TelemetryPayload } from '../types/agri';
import { Droplets, AlertTriangle, CheckCircle2, Zap, Hash, Cpu } from 'lucide-react';

interface SoilMoistureCardProps {
  telemetry: TelemetryPayload | null;
  isApiOffline: boolean;
}

export const SoilMoistureCard: React.FC<SoilMoistureCardProps> = ({ telemetry, isApiOffline }) => {
  if (isApiOffline || !telemetry) {
    return (
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-800 text-slate-500">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Soil Moisture</h3>
                <p className="text-xs text-slate-500">ADS1115 Channel A0</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
              OFFLINE
            </span>
          </div>

          <div className="status-banner status-banner-critical text-xs">
            <div className="flex items-center gap-2 font-semibold mb-1 text-slate-200">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              No Data — API Offline
            </div>
            <p className="text-slate-400">Cannot read ADS1115 soil sensor because the Raspberry Pi API is disconnected. No simulated telemetry is generated.</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
          <span>ADC Address: 0x48</span>
          <span>Channel: A0</span>
        </div>
      </div>
    );
  }

  const isUnavailable = telemetry.soilStatus === 'unavailable' || telemetry.soilMoisture === null;
  const moistureValue = telemetry.soilMoisture;
  const rawValue = telemetry.soilRaw;
  const voltageValue = telemetry.soilVoltage;
  const errorMsg = telemetry.soilError;

  return (
    <div className={`glass-card rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
      isUnavailable ? 'border-amber-500/30 bg-amber-950/10' : 'border-slate-800 hover:border-emerald-500/30'
    }`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl border ${
              isUnavailable
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Soil Moisture</h3>
              <p className="text-xs text-slate-400">ADS1115 (0x48) • A0</p>
            </div>
          </div>

          {isUnavailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 glow-amber">
              <AlertTriangle className="w-3.5 h-3.5" />
              UNAVAILABLE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 glow-emerald">
              <CheckCircle2 className="w-3.5 h-3.5" />
              AVAILABLE
            </span>
          )}
        </div>

        {/* Hardware Unavailable Alert Banner */}
        {isUnavailable ? (
          <div className="status-banner status-banner-warning text-xs mb-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-100 text-sm">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
              Soil Sensor Unavailable
            </div>
            <div className="font-mono bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-amber-300 text-[11px] overflow-x-auto">
              Error: {errorMsg || '[Errno 5] Input/output error'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              The Raspberry Pi reported an I2C communication failure with the ADS1115 ADC chip (Address 0x48).
              Check physical wiring (SDA, SCL, VCC 3.3V/5V, GND) and run <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">i2cdetect -y 1</code> on Pi.
            </p>
          </div>
        ) : (
          <div className="my-2">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-4xl font-extrabold text-slate-100 font-heading tracking-tight">
                {moistureValue}%
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                moistureValue < 45 ? 'bg-rose-500/20 text-rose-300' :
                moistureValue > 80 ? 'bg-blue-500/20 text-blue-300' :
                'bg-emerald-500/20 text-emerald-300'
              }`}>
                {moistureValue < 45 ? 'Low Moisture' : moistureValue > 80 ? 'Saturated' : 'Optimal'}
              </span>
            </div>

            <div className={`mb-3 flex items-center gap-2 text-[11px] font-semibold ${
              moistureValue < 45 ? 'text-rose-300' : 'text-slate-400'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              {moistureValue < 45 ? 'ALERT: Soil moisture below 45%' : 'Alert threshold: 45%'}
            </div>

            {/* Visual Moisture Progress Bar */}
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mb-4 border border-slate-800">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  moistureValue < 45 ? 'bg-gradient-to-r from-rose-500 to-orange-400' :
                  moistureValue > 80 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                  'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, moistureValue))}%` }}
              />
            </div>
          </div>
        )}

        {/* Detailed Hardware Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1 text-[11px] mb-1">
              <Hash className="w-3 h-3 text-emerald-400" />
              Raw ADC (16-bit)
            </span>
            <span className="font-mono text-sm font-semibold text-slate-200">
              {rawValue !== null ? rawValue : 'null'}
            </span>
          </div>

          <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1 text-[11px] mb-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              Voltage (Volts)
            </span>
            <span className="font-mono text-sm font-semibold text-slate-200">
              {voltageValue !== null ? `${voltageValue.toFixed(4)} V` : 'null'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-slate-500" />
          I2C: 0x48 (ADS1115)
        </span>
        <span>Pin: A0</span>
      </div>
    </div>
  );
};
