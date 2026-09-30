import React from 'react';
import { Recommendation } from '../types/recommendation';
import { CropConfig } from '../types/crop';
import { CheckCircle2, Droplets, Thermometer, Camera, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface RecommendationsPageProps {
  recommendations: Recommendation[];
  cropConfig: CropConfig;
  onOpenIrrigationModal: () => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  cropConfig,
  onOpenIrrigationModal
}) => {
  const categories = [
    { key: 'water', label: 'Water & Irrigation Management', icon: Droplets, color: 'text-blue-400' },
    { key: 'soil', label: 'Soil Health & Nutrition', icon: Droplets, color: 'text-amber-400' },
    { key: 'temperature', label: 'Temperature & Thermal Stress', icon: Thermometer, color: 'text-orange-400' },
    { key: 'disease', label: 'Disease Prevention & Leaf Health', icon: Camera, color: 'text-emerald-400' },
    { key: 'crop-health', label: 'General Crop Care', icon: Sparkles, color: 'text-purple-400' }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'medium': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Smart Agronomic Recommendations</h1>
          </div>
          <p className="text-xs text-slate-400">
            Actionable guidance for <strong>{cropConfig.name}</strong> based on field sensor inputs
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          {recommendations.length} Active Guidance Points
        </span>
      </div>

      {/* Category Groups */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const groupItems = recommendations.filter(r => r.category === cat.key || (cat.key === 'crop-health' && r.category === 'general'));

          if (groupItems.length === 0) return null;

          return (
            <div key={cat.key} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white">{cat.label}</h2>
              </div>

              <div className="space-y-4">
                {groupItems.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{rec.title}</h3>
                        <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-md border ${getPriorityBadge(rec.priority)}`}>
                          {rec.priority} Priority
                        </span>
                      </div>

                      {rec.category === 'water' && (
                        <button
                          onClick={onOpenIrrigationModal}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 self-start sm:self-auto"
                        >
                          <span>{rec.action}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>

                    {/* Detailed Metric Rationale grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Current Telemetry</span>
                        <strong className="text-slate-100">{rec.currentValue || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Ideal Range Target</span>
                        <strong className="text-emerald-400">{rec.idealValue || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Recommended Action</span>
                        <strong className="text-cyan-300">{rec.action}</strong>
                      </div>
                    </div>

                    {rec.whyItMatters && (
                      <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                        <strong className="text-slate-300">Why this matters:</strong> {rec.whyItMatters}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
