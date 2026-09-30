import React from 'react';
import { HealthScoreResult } from '../utils/healthScoreCalculator';
import { ShieldCheck, AlertTriangle, AlertCircle, Flame, Droplets, Thermometer, Camera } from 'lucide-react';

interface HealthScoreWidgetProps {
  healthResult: HealthScoreResult;
  cropName: string;
}

export const HealthScoreWidget: React.FC<HealthScoreWidgetProps> = ({ healthResult, cropName }) => {
  const { score, status, breakdown, primaryIssue } = healthResult;

  let colorClass = 'text-emerald-400 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/30';
  let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let statusIcon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;

  if (status === 'Needs Attention') {
    colorClass = 'text-amber-400 stroke-amber-500 bg-amber-500/10 border-amber-500/30';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    statusIcon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
  } else if (status === 'At Risk') {
    colorClass = 'text-orange-400 stroke-orange-500 bg-orange-500/10 border-orange-500/30';
    badgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    statusIcon = <AlertTriangle className="w-5 h-5 text-orange-400" />;
  } else if (status === 'Critical') {
    colorClass = 'text-rose-400 stroke-rose-500 bg-rose-500/10 border-rose-500/30';
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    statusIcon = <AlertCircle className="w-5 h-5 text-rose-400" />;
  }

  // SVG Circular Gauge calculation
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Crop Health Score</h3>
          <p className="text-xs text-slate-400">Integrated field vitality index for {cropName}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
          {statusIcon}
          {status}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
        {/* Circle Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`transition-all duration-1000 ease-out ${colorClass}`}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold tracking-tight text-white">{score}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">out of 100</span>
          </div>
        </div>

        {/* Breakdown Breakdown */}
        <div className="flex-1 w-full space-y-2.5">
          {primaryIssue && (
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-medium text-amber-200">
                Primary Factor: <strong className="underline">{primaryIssue}</strong>
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-blue-400" /> Soil Moisture</span>
              <span className="font-semibold text-slate-200">{breakdown.soilMoistureScore}%</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-amber-400" /> Thermal</span>
              <span className="font-semibold text-slate-200">{breakdown.temperatureScore}%</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-cyan-400" /> Humidity</span>
              <span className="font-semibold text-slate-200">{breakdown.humidityScore}%</span>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5"><Camera className="w-3.5 h-3.5 text-emerald-400" /> Camera AI</span>
              <span className="font-semibold text-slate-200">{breakdown.cameraHealthScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
