import React, { useState, useEffect } from 'react';
import { X, Play, Clock, CheckCircle2, RefreshCw, AlertCircle, Droplets } from 'lucide-react';
import { CropConfig } from '../types/crop';
import { SensorReading } from '../types/sensor';
import { irrigationService } from '../services/irrigationService';
import { IrrigationSession } from '../types/water';

interface IrrigationControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  cropConfig: CropConfig;
  currentReading: SensorReading;
  isDemoMode: boolean;
}

export const IrrigationControlModal: React.FC<IrrigationControlModalProps> = ({
  isOpen,
  onClose,
  cropConfig,
  currentReading,
  isDemoMode
}) => {
  const [activeSession, setActiveSession] = useState<IrrigationSession | null>(irrigationService.getActiveSession());
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const unsub = irrigationService.subscribe((sess) => setActiveSession(sess));
    return () => {
      unsub();
    };
  }, []);

  if (!isOpen) return null;

  const targetMid = Math.round((cropConfig.idealSoilMoistureMin + cropConfig.idealSoilMoistureMax) / 2);
  const estDuration = Math.min(45, Math.max(10, Math.round((targetMid - currentReading.soilMoisture) * 1.5)));

  const handleStart = async () => {
    setIsStarting(true);
    setStatusNotice(null);
    try {
      const res = await irrigationService.startIrrigation(cropConfig, currentReading);
      setStatusNotice(res.message);
    } catch (e: any) {
      setStatusNotice('Failed to start irrigation cycle.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    await irrigationService.stopIrrigation();
    setStatusNotice('Irrigation process stopped.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-blue-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Irrigation Recommendation</h2>
              <p className="text-xs text-slate-400">Precision Field Hydration Control</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Target Parameters Box */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400">Selected Crop</span>
              <p className="text-base font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span>{cropConfig.icon}</span> {cropConfig.name}
              </p>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400">Current Soil Moisture</span>
              <p className="text-base font-bold text-white mt-0.5">{currentReading.soilMoisture}%</p>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400">Ideal Target Range</span>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">
                {cropConfig.idealSoilMoistureMin}–{cropConfig.idealSoilMoistureMax}%
              </p>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400">Estimated Duration</span>
              <p className="text-sm font-semibold text-cyan-300 mt-0.5">{estDuration} minutes</p>
            </div>
          </div>

          {/* Status Notice Banner */}
          {statusNotice && (
            <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-blue-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{statusNotice}</span>
            </div>
          )}

          {/* Demo Mode Hardware Disclaimer Banner */}
          {isDemoMode && (
            <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-amber-300/90 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Hardware Note:</strong> Real irrigation hardware is simulated in Demo Mode. Clicking "Start Irrigation" will simulate pump hydration without physical hardware triggers.
              </span>
            </div>
          )}

          {/* Active Irrigation Session Feedback */}
          {activeSession && (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Status: {activeSession.status}
                </span>
                <span className="text-slate-400">Elapsed: {activeSession.elapsedSeconds}s</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (activeSession.elapsedSeconds / (activeSession.estimatedDurationMinutes * 60)) * 100)}%`
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Current Soil Moisture: {activeSession.currentSoilMoisture}%</span>
                <span>Target: {targetMid}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
          {activeSession && activeSession.status === 'Active' ? (
            <button
              onClick={handleStop}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl transition-all"
            >
              Stop Irrigation
            </button>
          ) : (
            <>
              <button
                onClick={() => setStatusNotice('Irrigation cycle scheduled for 06:00 AM tomorrow.')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Schedule Irrigation</span>
              </button>

              <button
                onClick={handleStart}
                disabled={isStarting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
              >
                <Play className="w-4 h-4" />
                <span>Start Irrigation</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
