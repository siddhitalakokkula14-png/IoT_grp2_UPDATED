import React from 'react';
import { Alert } from '../types/alert';
import { AlertTriangle, AlertCircle, Bell, Check, CheckCircle2, Camera } from 'lucide-react';
import { alertService } from '../services/alertService';

interface AlertsWidgetProps {
  alerts: Alert[];
  onRefreshAlerts?: () => void;
}

export const AlertsWidget: React.FC<AlertsWidgetProps> = ({ alerts, onRefreshAlerts }) => {
  const handleMarkRead = (id: string) => {
    alertService.markAsRead(id);
    if (onRefreshAlerts) onRefreshAlerts();
  };

  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
          bg: 'bg-rose-950/20 border-rose-500/30 text-rose-200',
          badge: 'bg-rose-500/20 text-rose-300'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          bg: 'bg-amber-950/20 border-amber-500/30 text-amber-200',
          badge: 'bg-amber-500/20 text-amber-300'
        };
      case 'camera':
        return {
          icon: <Camera className="w-5 h-5 text-emerald-400" />,
          bg: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200',
          badge: 'bg-emerald-500/20 text-emerald-300'
        };
      case 'attention':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-cyan-400" />,
          bg: 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200',
          badge: 'bg-cyan-500/20 text-cyan-300'
        };
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          bg: 'bg-slate-900/60 border-slate-800 text-slate-300',
          badge: 'bg-emerald-500/20 text-emerald-300'
        };
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">System Alerts</h3>
            <p className="text-xs text-slate-400">Real-time threshold notifications</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {alerts.filter(a => !a.readStatus).length} Unread
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alt) => {
          const style = getAlertStyle(alt.severity);
          return (
            <div
              key={alt.id}
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${style.bg} ${
                alt.readStatus ? 'opacity-60' : 'shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{style.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-xs font-bold text-white">{alt.title}</h4>
                    <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${style.badge}`}>
                      {alt.severity}
                    </span>
                    <span className="text-[10px] text-slate-400">{alt.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300">{alt.message}</p>
                </div>
              </div>

              {!alt.readStatus && (
                <button
                  onClick={() => handleMarkRead(alt.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white shrink-0"
                  title="Mark as Read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
