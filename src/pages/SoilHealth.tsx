import React, { useState, useEffect } from 'react';
import { CropConfig } from '../types/crop';
import { SensorReading, TimeRangeFilter } from '../types/sensor';
import { sensorService } from '../services/sensorService';
import { Droplets, TrendingDown, Info, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SoilHealthProps {
  cropConfig: CropConfig;
  currentReading: SensorReading;
  onOpenIrrigationModal: () => void;
}

export const SoilHealth: React.FC<SoilHealthProps> = ({
  cropConfig,
  currentReading,
  onOpenIrrigationModal
}) => {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('24h');
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sensorService.getHistory(timeRange).then(data => {
      setHistory(data);
      setLoading(false);
    });
  }, [timeRange]);

  const formattedChartData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    moisture: h.soilMoisture,
    minIdeal: cropConfig.idealSoilMoistureMin,
    maxIdeal: cropConfig.idealSoilMoistureMax
  }));

  let statusText = 'Optimal Soil Hydration';
  let statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (currentReading.soilMoisture < cropConfig.idealSoilMoistureMin) {
    statusText = 'Moderately Dry Soil';
    statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  } else if (currentReading.soilMoisture > cropConfig.idealSoilMoistureMax) {
    statusText = 'High Moisture Level';
    statusBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Soil Health & Moisture Analytics</h1>
          </div>
          <p className="text-xs text-slate-400">
            Precision root-zone moisture tracking tailored for {cropConfig.name}
          </p>
        </div>

        <button
          onClick={onOpenIrrigationModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2"
        >
          <Droplets className="w-4 h-4" />
          <span>Irrigation Assistant</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Current Soil Moisture</span>
          <div className="text-3xl font-extrabold text-white my-1">{currentReading.soilMoisture}%</div>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge}`}>
            {statusText}
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Ideal Range for {cropConfig.name}</span>
          <div className="text-3xl font-extrabold text-emerald-400 my-1">
            {cropConfig.idealSoilMoistureMin}–{cropConfig.idealSoilMoistureMax}%
          </div>
          <span className="text-[11px] text-slate-400">Target Root-Zone Hydration</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Soil Hydration Status</span>
          <div className="text-lg font-bold text-slate-100 my-1">
            {currentReading.soilMoisture < cropConfig.idealSoilMoistureMin ? 'Needs Hydration' : 'Well Hydrated'}
          </div>
          <p className="text-[11px] text-slate-400">Based on multi-layer moisture telemetry</p>
        </div>
      </div>

      {/* Insight Highlight Card */}
      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center gap-3 text-blue-200 text-xs">
        <Info className="w-5 h-5 text-blue-400 shrink-0" />
        <div>
          <strong>Soil Moisture Insight:</strong> Soil moisture has decreased approximately <strong>8% during the last 6 hours</strong> due to natural transpiration and evaporation.
        </div>
      </div>

      {/* Interactive Trend Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">Moisture Trend Graph</h3>
            <p className="text-xs text-slate-400">Root-zone soil water retention timeline</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(['24h', '7d', '30d'] as TimeRangeFilter[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  timeRange === r ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400">Loading soil trend data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" name="Soil Moisture (%)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
