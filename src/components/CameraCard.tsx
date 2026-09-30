import React, { useState } from 'react';
import { TelemetryPayload } from '../types/agri';
import { Camera, RefreshCw, Eye, CameraOff, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

interface CameraCardProps {
  telemetry: TelemetryPayload | null;
  isApiOffline: boolean;
}

export const CameraCard: React.FC<CameraCardProps> = ({ telemetry, isApiOffline }) => {
  const [imageTimestamp, setImageTimestamp] = useState<string>(Date.now().toString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);

  const cameraTelemetry = telemetry?.camera;
  const isCameraOnline = !isApiOffline && cameraTelemetry && cameraTelemetry.status === 'online';

  const currentImageUrl = isApiOffline ? '' : apiService.getCameraImageUrl(imageTimestamp);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setHasImageError(false);
    setImageTimestamp(Date.now().toString());
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <>
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-cyan-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Field Camera</h3>
                <p className="text-xs text-slate-500">Raspberry Pi Camera Module</p>
              </div>
            </div>

            {isApiOffline ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-500 border border-slate-700">
                OFFLINE
              </span>
            ) : isCameraOnline ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 glow-cyan">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                ONLINE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <CameraOff className="w-3.5 h-3.5" />
                DISCONNECTED
              </span>
            )}
          </div>

          {/* Image Container Frame */}
          <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group flex items-center justify-center">
            {isApiOffline || !isCameraOnline || hasImageError ? (
              <div className="p-6 text-center text-slate-500 space-y-2">
                <CameraOff className="w-10 h-10 mx-auto text-slate-600 mb-1" />
                <p className="text-xs font-medium text-slate-400">
                  {isApiOffline
                    ? 'API Offline — Camera stream unreachable'
                    : 'Camera hardware offline or capture failed'}
                </p>
                <p className="text-[11px] text-slate-600">
                  Check Pi Camera ribbon cable connector or libcamera configuration.
                </p>
              </div>
            ) : (
              <>
                <img
                  src={currentImageUrl}
                  alt="Raspberry Pi Crop Camera Frame"
                  onError={() => setHasImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Hover overlay with full screen button */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowFullModal(true)}
                    className="p-2.5 rounded-xl bg-slate-900/90 text-slate-100 border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Enlarge Image
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate max-w-[200px] text-[11px]">
            Captured: {cameraTelemetry?.capturedAt ? new Date(cameraTelemetry.capturedAt).toLocaleTimeString() : 'Live Stream'}
          </span>

          <button
            onClick={handleRefresh}
            disabled={isApiOffline || isRefreshing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-xs font-medium ${
              isRefreshing ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Frame
          </button>
        </div>
      </div>

      {/* Full Modal Viewer */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Live Camera Snapshot — Raspberry Pi 4</h3>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
              <img src={currentImageUrl} alt="Full View Camera Snapshot" className="max-h-[75vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
