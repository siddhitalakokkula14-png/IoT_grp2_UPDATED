import React from 'react';
import { Play, RotateCcw, Droplets, Thermometer, AlertCircle, Camera, Cpu } from 'lucide-react';
import { sensorService } from '../services/sensorService';
import { cameraService } from '../services/cameraService';

interface DemoModeToolbarProps {
  onStateChanged: () => void;
  cropName: string;
}

export const DemoModeToolbar: React.FC<DemoModeToolbarProps> = ({ onStateChanged, cropName }) => {
  const handleLowMoisture = () => {
    sensorService.triggerLowMoisture();
    onStateChanged();
  };

  const handleLowWater = () => {
    sensorService.triggerLowWater();
    onStateChanged();
  };

  const handleHighTemp = () => {
    sensorService.triggerHighTemp();
    onStateChanged();
  };

  const handleDiseaseCamera = () => {
    cameraService.triggerSimulatedDisease(`${cropName} Early Blight`, cropName);
    sensorService.notifyListeners();
    onStateChanged();
  };

  const handleReset = () => {
    sensorService.resetDemo();
    onStateChanged();
  };

  return (
    <div className="bg-slate-900/90 border-t border-slate-800 py-3 px-4 backdrop-blur-md sticky bottom-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200">Demo Mode Controller</span>
            <span className="text-[11px] text-slate-400 block sm:inline sm:ml-2">Simulate Raspberry Pi sensor triggers</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={handleLowMoisture}
            className="px-2.5 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-500/30 flex items-center gap-1 font-medium transition-all"
            title="Simulate soil drying to 32%"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Low Moisture (32%)</span>
          </button>

          <button
            onClick={handleLowWater}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-medium transition-all"
            title="Simulate water tank dropping to 14%"
          >
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Low Tank (14%)</span>
          </button>

          <button
            onClick={handleHighTemp}
            className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-medium transition-all"
            title="Simulate heat spike to 34.5°C"
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>High Temp (34.5°C)</span>
          </button>

          <button
            onClick={handleDiseaseCamera}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-medium transition-all"
            title="Simulate camera detecting leaf disease"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Detect Disease</span>
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 font-medium transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
