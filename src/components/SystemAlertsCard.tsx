import React from 'react';
import { TelemetryPayload } from '../types/agri';
import { AlertCircle, WifiOff, AlertTriangle, CameraOff, Clock, CheckCircle2, Droplets, Sprout } from 'lucide-react';

interface SystemAlertsCardProps {
  telemetry: TelemetryPayload | null;
  isApiOffline: boolean;
  isStale: boolean;
  errorMessage: string | null;
}

export const SystemAlertsCard: React.FC<SystemAlertsCardProps> = ({
  telemetry,
  isApiOffline,
  isStale,
  errorMessage
}) => {
  const alerts: { id: string; type: 'critical' | 'warning' | 'info'; title: string; desc: string; icon: any }[] = [];

  if (isApiOffline) {
    alerts.push({
      id: 'api-offline',
      type: 'critical',
      title: 'API OFFLINE — unable to receive live data from Raspberry Pi.',
      desc: errorMessage || 'Flask API server at 5000 is not responding. Check power & network connection.',
      icon: WifiOff
    });
  }

  if (telemetry && (telemetry.soilStatus === 'unavailable' || telemetry.soilMoisture === null)) {
    alerts.push({
      id: 'soil-error',
      type: 'warning',
      title: 'SOIL SENSOR UNAVAILABLE',
      desc: telemetry.soilError || '[Errno 5] Input/output error — ADS1115 ADC @ 0x48 communication glitch.',
      icon: AlertTriangle
    });
  }

  if (telemetry && telemetry.soilMoisture !== null && telemetry.soilMoisture < 45) {
    alerts.push({
      id: 'soil-below-45',
      type: 'critical',
      title: `Soil Moisture Below 45% — ${telemetry.soilMoisture}%`,
      desc: 'Website alert: soil moisture has crossed the configured 45% threshold. Check irrigation.',
      icon: Sprout
    });
  }

  if (telemetry && telemetry.waterLevel !== null && telemetry.waterLevel !== undefined && telemetry.waterLevel < 40) {
    alerts.push({
      id: 'water-below-40',
      type: 'warning',
      title: `Water Level Below 40% — ${telemetry.waterLevel}%`,
      desc: 'Website alert: water level has crossed the configured 40% threshold. Refill the tank.',
      icon: Droplets
    });
  }

  if (telemetry && (telemetry.camera?.status === 'offline' || telemetry.camera?.status === 'unavailable')) {
    alerts.push({
      id: 'camera-error',
      type: 'info',
      title: 'Pi Camera Offline',
      desc: telemetry.camera?.error || 'Camera module not detected or capture process paused.',
      icon: CameraOff
    });
  }

  if (telemetry && (telemetry.pump === 'unavailable' || telemetry.relay === 'unavailable')) {
    alerts.push({
      id: 'pump-error',
      type: 'warning',
      title: 'Irrigation Relay Unavailable',
      desc: 'Relay module or GPIO controller is unresponsive.',
      icon: AlertCircle
    });
  }

  if (!isApiOffline && isStale) {
    alerts.push({
      id: 'stale-telemetry',
      type: 'info',
      title: 'Stale Telemetry Data',
      desc: 'No telemetry update received in the last 10 seconds. Polling may be lagging.',
      icon: Clock
    });
  }

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl border ${
              alerts.length > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">System Diagnostic Alerts</h3>
              <p className="text-xs text-slate-500">Real-Time Hardware Health Logs</p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            alerts.length > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {alerts.length} Active {alerts.length === 1 ? 'Notice' : 'Notices'}
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="status-banner status-banner-success text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold block text-slate-100">All Hardware Systems Nominal</span>
              <span className="text-slate-400">Raspberry Pi 4, ADS1115 (0x48), Relay, and Telemetry bus operating normally.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {alerts.map((item) => {
              const IconComp = item.icon;
              const railClass =
                item.type === 'critical'
                  ? 'status-banner-critical'
                  : item.type === 'warning'
                  ? 'status-banner-warning'
                  : 'status-banner-info';
              const iconColor =
                item.type === 'critical'
                  ? 'text-red-400'
                  : item.type === 'warning'
                  ? 'text-amber-400'
                  : 'text-sky-400';
              return (
                <div
                  key={item.id}
                  className={`status-banner ${railClass} text-xs flex items-start gap-2.5`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                  <div>
                    <h4 className="font-semibold text-slate-200">{item.title}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>Automatic Diagnostic Monitor</span>
        <span>Polling Active</span>
      </div>
    </div>
  );
};
