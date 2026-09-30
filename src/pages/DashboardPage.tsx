import React from 'react';
import { ConnectionStatus, TelemetryPayload, StatusResponse, SoilReadingHistoryPoint } from '../types/agri';
import { ConnectionStatusCard } from '../components/ConnectionStatusCard';
import { SoilMoistureCard } from '../components/SoilMoistureCard';
import { WaterLevelCard } from '../components/WaterLevelCard';
import { CameraCard } from '../components/CameraCard';
import { DeviceInfoCard } from '../components/DeviceInfoCard';
import { AutoIrrigationCard } from '../components/AutoIrrigationCard';
import { SystemAlertsCard } from '../components/SystemAlertsCard';
import { SoilHistoryChart } from '../components/SoilHistoryChart';
import { Bell, Droplets, Sprout, Wifi } from 'lucide-react';

interface DashboardPageProps {
  connectionStatus: ConnectionStatus;
  telemetry: TelemetryPayload | null;
  statusInfo: StatusResponse | null;
  latencyMs: number | null;
  apiUrl: string;
  lastUpdated: Date | null;
  isStale: boolean;
  errorMessage: string | null;
  history: SoilReadingHistoryPoint[];
  onOpenSettings: () => void;
  onManualRefresh: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  connectionStatus,
  telemetry,
  statusInfo,
  latencyMs,
  apiUrl,
  lastUpdated,
  isStale,
  errorMessage,
  history,
  onOpenSettings,
  onManualRefresh
}) => {
  const isApiOffline = connectionStatus === 'OFFLINE';

  return (
    <div className="space-y-6">
      {/* Live threshold summary */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Smart Field Monitor</h2>
              <p className="text-xs text-slate-400">Live alerts are active for the two new safety thresholds.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold">
              <Sprout className="w-3.5 h-3.5" /> Soil alert &lt; 45%
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
              <Droplets className="w-3.5 h-3.5" /> Water alert &lt; 40%
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
              <Wifi className="w-3.5 h-3.5" /> 1s live polling
            </span>
          </div>
        </div>
      </div>

      {/* 7-Card Main Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Raspberry Pi Connection Status Card */}
        <ConnectionStatusCard
          connectionStatus={connectionStatus}
          telemetry={telemetry}
          latencyMs={latencyMs}
          apiUrl={apiUrl}
          lastUpdated={lastUpdated}
          isStale={isStale}
          errorMessage={errorMessage}
          onOpenSettings={onOpenSettings}
          onManualRefresh={onManualRefresh}
        />

        {/* 2. Soil Moisture Card (ADS1115 A0 + Errno 5 handling) */}
        <SoilMoistureCard
          telemetry={telemetry}
          isApiOffline={isApiOffline}
        />

        {/* 3. Water Level Card (ADS1115 0x49 A0) */}
        <WaterLevelCard
          telemetry={telemetry}
          isApiOffline={isApiOffline}
        />

        {/* 4. Camera Card (Pi Camera Stream) */}
        <CameraCard
          telemetry={telemetry}
          isApiOffline={isApiOffline}
        />

        {/* 5. Device Information Card */}
        <DeviceInfoCard
          telemetry={telemetry}
          statusInfo={statusInfo}
          apiUrl={apiUrl}
          latencyMs={latencyMs}
          isApiOffline={isApiOffline}
        />

        {/* 6. Automatic Irrigation Status Card */}
        <AutoIrrigationCard
          telemetry={telemetry}
          isApiOffline={isApiOffline}
          onRefresh={onManualRefresh}
        />

        {/* 7. System Diagnostic Alerts Widget */}
        <div className="md:col-span-2 lg:col-span-3">
          <SystemAlertsCard
            telemetry={telemetry}
            isApiOffline={isApiOffline}
            isStale={isStale}
            errorMessage={errorMessage}
          />
        </div>
      </div>

      {/* Real-time Telemetry Moisture History Chart (No fake points) */}
      <div className="w-full">
        <SoilHistoryChart
          history={history}
          isApiOffline={isApiOffline}
        />
      </div>
    </div>
  );
};
