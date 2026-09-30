import React from 'react';
import { SelectedCropState, CropConfig } from '../types/crop';
import { SensorReading } from '../types/sensor';
import { HealthScoreResult } from '../utils/healthScoreCalculator';
import { Recommendation } from '../types/recommendation';
import { Alert } from '../types/alert';
import { CameraAnalysisResult } from '../types/camera';

import { HealthScoreWidget } from '../components/HealthScoreWidget';
import { FieldConditionCard } from '../components/FieldConditionCard';
import { RecommendationsList } from '../components/RecommendationsList';
import { CameraAnalysisWidget } from '../components/CameraAnalysisWidget';
import { AlertsWidget } from '../components/AlertsWidget';
import { WaterTankWidget } from '../components/WaterTankWidget';
import { WaterTankState } from '../types/water';

import { Droplets, Thermometer, Sun, Gauge, Sprout, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  cropConfig: CropConfig;
  selectedCropState: SelectedCropState;
  sensorReading: SensorReading;
  healthResult: HealthScoreResult;
  recommendations: Recommendation[];
  alerts: Alert[];
  waterState: WaterTankState;
  isDemoMode: boolean;
  onOpenCropSelector: () => void;
  onOpenIrrigationModal: () => void;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  cropConfig,
  selectedCropState,
  sensorReading,
  healthResult,
  recommendations,
  alerts,
  waterState,
  isDemoMode,
  onOpenCropSelector,
  onOpenIrrigationModal,
  onRefresh
}) => {
  // Soil Moisture Status Helper
  const getSoilMoistureStatus = () => {
    const val = sensorReading.soilMoisture;
    if (val < cropConfig.idealSoilMoistureMin - 10) return { text: '⚠️ Critically Dry', type: 'critical' as const, advice: `💧 Soil moisture is ${val}%. Irrigate field immediately.` };
    if (val < cropConfig.idealSoilMoistureMin) return { text: '⚠️ Slightly Dry', type: 'warning' as const, advice: `💧 Your ${cropConfig.name} field is slightly dry. Recommended: Irrigate.` };
    if (val > cropConfig.idealSoilMoistureMax) return { text: '⚠️ High Water', type: 'warning' as const, advice: 'Pause irrigation to prevent root hypoxia.' };
    return { text: 'Optimal', type: 'optimal' as const, advice: undefined };
  };

  // Temperature Status Helper
  const getTempStatus = () => {
    const val = sensorReading.temperature;
    if (val > cropConfig.idealTemperatureMax) return { text: '⚠️ Heat Stress', type: 'warning' as const, advice: `Current temp is above preferred max (${cropConfig.idealTemperatureMax}°C).` };
    if (val < cropConfig.idealTemperatureMin) return { text: '⚠️ Cold', type: 'attention' as const, advice: `Current temp is below target min (${cropConfig.idealTemperatureMin}°C).` };
    return { text: 'Optimal', type: 'optimal' as const, advice: undefined };
  };

  const soilStatus = getSoilMoistureStatus();
  const tempStatus = getTempStatus();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Crop Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-md">
            {cropConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">Active Monitoring</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Stage: {selectedCropState.growthStage || 'Vegetative'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Your Crop:</span>
              <span className="text-emerald-400">{cropConfig.name}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Ideal Soil Moisture Target: <strong className="text-slate-200">{cropConfig.idealSoilMoistureMin}% – {cropConfig.idealSoilMoistureMax}%</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCropSelector}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span>Change Crop</span>
        </button>
      </div>

      {/* Top Row: Crop Health Score & Quick Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <HealthScoreWidget healthResult={healthResult} cropName={cropConfig.name} />
        </div>
        <div className="lg:col-span-6">
          <RecommendationsList
            recommendations={recommendations}
            onActionClick={(rec) => {
              if (rec.category === 'water' || rec.action.includes('Irrigate')) {
                onOpenIrrigationModal();
              }
            }}
          />
        </div>
      </div>

      {/* Field Condition Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Field Conditions</h2>
          <span className="text-xs text-slate-400">Updated Real-Time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <FieldConditionCard
            title="Soil Moisture"
            value={`${sensorReading.soilMoisture}%`}
            icon={Droplets}
            iconColor="text-blue-400"
            statusText={soilStatus.text}
            statusType={soilStatus.type}
            idealRange={`${cropConfig.idealSoilMoistureMin}–${cropConfig.idealSoilMoistureMax}%`}
            trendText="-2% in last hr"
            trendDirection="down"
            advice={soilStatus.advice}
            onClick={onOpenIrrigationModal}
          />

          <FieldConditionCard
            title="Temperature"
            value={`${sensorReading.temperature}°C`}
            icon={Thermometer}
            iconColor="text-amber-400"
            statusText={tempStatus.text}
            statusType={tempStatus.type}
            idealRange={`${cropConfig.idealTemperatureMin}–${cropConfig.idealTemperatureMax}°C`}
            trendText="+0.4°C"
            trendDirection="up"
            advice={tempStatus.advice}
          />

          <FieldConditionCard
            title="Humidity"
            value={`${sensorReading.humidity}%`}
            icon={Droplets}
            iconColor="text-cyan-400"
            statusText="Normal"
            statusType="optimal"
            idealRange={`${cropConfig.idealHumidityMin}–${cropConfig.idealHumidityMax}%`}
            trendText="Stable"
            trendDirection="neutral"
          />

          <FieldConditionCard
            title="Light Intensity"
            value={`${sensorReading.light}`}
            unit="lux"
            icon={Sun}
            iconColor="text-yellow-400"
            statusText="Optimal"
            statusType="optimal"
            idealRange="500–1200 lux"
            trendText="Daylight"
            trendDirection="up"
          />

          <FieldConditionCard
            title="Water Level"
            value={`${sensorReading.waterLevel}%`}
            icon={Gauge}
            iconColor="text-emerald-400"
            statusText={waterState.status}
            statusType={waterState.status === 'Low' ? 'warning' : waterState.status === 'Critical' ? 'critical' : 'optimal'}
            idealRange="40–100%"
            trendText={`${waterState.currentVolumeLiters}L`}
            trendDirection="neutral"
            onClick={onOpenIrrigationModal}
          />
        </div>
      </div>

      {/* Middle Row: Camera AI & Water Reservoir */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CameraAnalysisWidget currentCropName={cropConfig.name} />
        </div>
        <div className="lg:col-span-5">
          <WaterTankWidget
            tankState={waterState}
            isDemoMode={isDemoMode}
            onStartIrrigation={onOpenIrrigationModal}
          />
        </div>
      </div>

      {/* Bottom Row: System Alerts Ticker */}
      <AlertsWidget alerts={alerts} onRefreshAlerts={onRefresh} />
    </div>
  );
};
