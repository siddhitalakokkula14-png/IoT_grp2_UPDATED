import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface FieldConditionCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  iconColor: string;
  statusText: string;
  statusType: 'optimal' | 'warning' | 'critical' | 'attention';
  idealRange: string;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  advice?: string;
  onClick?: () => void;
}

export const FieldConditionCard: React.FC<FieldConditionCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  iconColor,
  statusText,
  statusType,
  idealRange,
  trendText,
  trendDirection = 'neutral',
  advice,
  onClick
}) => {
  let badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  if (statusType === 'warning') {
    badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (statusType === 'critical') {
    badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (statusType === 'attention') {
    badgeStyle = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  }

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      }`}
    >
      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-slate-300">{title}</span>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
            {statusText}
          </span>
        </div>

        {/* Main Value Display */}
        <div className="flex items-baseline gap-1 my-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
          {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
        </div>

        {/* Ideal Range & Trend */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80 mt-2">
          <span className="text-slate-400">
            Ideal: <strong className="text-slate-200">{idealRange}</strong>
          </span>

          {trendText && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
              {trendDirection === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
              {trendDirection === 'down' && <TrendingDown className="w-3 h-3 text-rose-400" />}
              {trendDirection === 'neutral' && <Minus className="w-3 h-3 text-slate-500" />}
              {trendText}
            </span>
          )}
        </div>
      </div>

      {/* Actionable Advice Banner */}
      {advice && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] text-amber-300/90 bg-amber-950/20 px-2.5 py-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
          <span>{advice}</span>
        </div>
      )}
    </div>
  );
};
