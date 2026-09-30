import React from 'react';
import { SoilReadingHistoryPoint } from '../types/agri';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LineChart, Database, Activity } from 'lucide-react';

interface SoilHistoryChartProps {
  history: SoilReadingHistoryPoint[];
  isApiOffline: boolean;
}

export const SoilHistoryChart: React.FC<SoilHistoryChartProps> = ({ history, isApiOffline }) => {
  const hasEnoughData = !isApiOffline && history.length >= 2;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-400">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Live Soil Moisture Telemetry Trend</h3>
              <p className="text-xs text-slate-500">Recorded Live Readings Only (Session Buffer)</p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-slate-900 border border-slate-800 text-emerald-400">
            <Database className="w-3.5 h-3.5" />
            {history.length} Live {history.length === 1 ? 'Reading' : 'Readings'}
          </span>
        </div>

        {/* Empty State / Insufficient Data Placeholder */}
        {!hasEnoughData ? (
          <div className="min-h-[220px] rounded-xl bg-slate-950/60 border border-dashed border-slate-800 p-8 flex flex-col items-center justify-center text-center">
            <Activity className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
            <h4 className="text-sm font-bold text-slate-300 mb-1">
              {isApiOffline ? 'API Offline — Chart Paused' : 'Waiting for Live Telemetry Data...'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md">
              {isApiOffline
                ? 'Connect Raspberry Pi API to stream real sensor telemetry. No simulated historical readings are generated.'
                : `Collecting real telemetry points from ADS1115 A0. At least 2 live polls required (${history.length}/2 received).`}
            </p>
          </div>
        ) : (
          <div className="h-[240px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="timeFormatted"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`${value}%`, 'Soil Moisture']}
                  labelFormatter={(label: any) => `Time: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="moisture"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#moistureGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>Source: Live Flask Telemetry Endpoint (/api/telemetry)</span>
        <span>Zero Mock Data Policy</span>
      </div>
    </div>
  );
};
