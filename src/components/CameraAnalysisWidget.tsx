import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, RefreshCw, Eye, Sparkles, ShieldAlert } from 'lucide-react';
import { cameraService } from '../services/cameraService';
import { CameraAnalysisResult } from '../types/camera';

interface CameraAnalysisWidgetProps {
  currentCropName: string;
  onAnalysisComplete?: (result: CameraAnalysisResult) => void;
}

export const CameraAnalysisWidget: React.FC<CameraAnalysisWidgetProps> = ({
  currentCropName,
  onAnalysisComplete
}) => {
  const [imageUrl, setImageUrl] = useState<string>(cameraService.getLatestImage());
  const [analysis, setAnalysis] = useState<CameraAnalysisResult | null>(cameraService.getLatestAnalysis());
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    try {
      const dataUrl = await cameraService.uploadImage(file);
      setImageUrl(dataUrl);
      // Auto analyze after upload
      handleAnalyze(dataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Please upload a valid crop image (JPEG, PNG, or WEBP).');
    }
  };

  const handleAnalyze = async (overrideImage?: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const result = await cameraService.analyzeImage(overrideImage || imageUrl, currentCropName);
      setAnalysis(result);
      if (onAnalysisComplete) onAnalysisComplete(result);
    } catch (err: any) {
      setErrorMessage('Unable to analyze this image. Please try again with a clearer crop photo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Crop Camera Analysis</h3>
            <p className="text-xs text-slate-400">Logitech USB Camera & AI Leaf Health Diagnostic</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Image Preview vs Diagnostic Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Left: Camera Feed Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-inner group">
          <img
            src={imageUrl}
            alt="Crop Camera Feed"
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Scanner Overlay during analysis */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute animate-scan-line" />
              <div className="bg-slate-900/90 border border-emerald-500/40 px-4 py-2 rounded-xl shadow-xl flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-sm font-semibold text-emerald-300">Analyzing crop image...</span>
              </div>
            </div>
          )}

          {/* Timestamp Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Capture: {analysis?.captureTime || 'Just Now'}
          </div>
        </div>

        {/* Right: AI Identification Results */}
        <div className="space-y-4">
          {analysis ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Detected Crop</span>
                  <h4 className="text-lg font-extrabold text-white">{analysis.detectedCrop}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confidence</span>
                  <p className="text-lg font-bold text-emerald-400">{analysis.confidence}%</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Likely Condition:</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    analysis.condition === 'Healthy'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {analysis.possibleDisease || analysis.condition}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Severity:</span>
                  <span className="text-xs font-medium text-slate-200">{analysis.severity}</span>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-1">Observed Features:</p>
                <ul className="space-y-1">
                  {analysis.symptoms.map((sym, idx) => (
                    <li key={idx} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {sym}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Advice */}
              <div className="pt-2 border-t border-slate-800 text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                <strong>Recommended Action:</strong> {analysis.recommendations[0]}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
              <Eye className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm">Click "Analyze Image" to run AI diagnosis on field camera feed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
