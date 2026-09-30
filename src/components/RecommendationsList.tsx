import React from 'react';
import { Recommendation } from '../types/recommendation';
import { Sparkles, Droplets, Camera, Thermometer, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: Recommendation[];
  onActionClick?: (rec: Recommendation) => void;
  maxItems?: number;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  onActionClick,
  maxItems = 4
}) => {
  const displayItems = recommendations.slice(0, maxItems);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'medium':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water':
      case 'soil':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'temperature':
        return <Thermometer className="w-4 h-4 text-amber-400" />;
      case 'disease':
      case 'crop-health':
        return <Camera className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Today's Recommendations</h3>
            <p className="text-xs text-slate-400">Smart prioritized agronomic advice for your field</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {recommendations.length} Actions
        </span>
      </div>

      <div className="space-y-3">
        {displayItems.length === 0 ? (
          <div className="p-6 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium">All field parameters are optimal!</p>
          </div>
        ) : (
          displayItems.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0 mt-0.5 sm:mt-0">
                  {getCategoryIcon(rec.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-100">{rec.title}</h4>
                    <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md border ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-1">{rec.description}</p>
                  {rec.currentValue && (
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Current: <strong className="text-slate-200">{rec.currentValue}</strong></span>
                      {rec.idealValue && <span>Ideal Target: <strong className="text-emerald-400">{rec.idealValue}</strong></span>}
                    </div>
                  )}
                </div>
              </div>

              {onActionClick && (
                <button
                  onClick={() => onActionClick(rec)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0"
                >
                  <span>{rec.action}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
