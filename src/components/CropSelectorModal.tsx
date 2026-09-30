import React, { useState } from 'react';
import { Search, X, Check, Sprout, Plus } from 'lucide-react';
import { DEFAULT_CROPS } from '../data/cropConfig';
import { SelectedCropState } from '../types/crop';

interface CropSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCropState: SelectedCropState;
  onSelectCrop: (newState: SelectedCropState) => void;
}

export const CropSelectorModal: React.FC<CropSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCropState,
  onSelectCrop
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCropName, setCustomCropName] = useState(selectedCropState.customName || '');
  const [isOtherSelected, setIsOtherSelected] = useState(selectedCropState.cropId === 'other');

  if (!isOpen) return null;

  const filteredCrops = DEFAULT_CROPS.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (cropId: string) => {
    if (cropId === 'other') {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
      onSelectCrop({
        ...selectedCropState,
        cropId,
        customName: undefined
      });
      onClose();
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCropName.trim()) return;

    onSelectCrop({
      ...selectedCropState,
      cropId: 'other',
      customName: customCropName.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌱</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                What crop are you growing?
              </h2>
            </div>
            <p className="text-slate-400 text-sm">
              Select your crop to receive personalized monitoring and recommendations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close Crop Selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800/60 bg-slate-950/40">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crops (e.g. Potato, Tomato, Rice)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Crops Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isOtherSelected ? (
            <form onSubmit={handleCustomSubmit} className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700">
              <label className="block text-sm font-medium text-slate-200">
                Enter Custom Crop Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dragonfruit, Mustard, Barley..."
                value={customCropName}
                onChange={(e) => setCustomCropName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
              />
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/30"
                >
                  Save Custom Crop
                </button>
                <button
                  type="button"
                  onClick={() => setIsOtherSelected(false)}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-xl"
                >
                  Back to List
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredCrops.map((crop) => {
                const isSelected = selectedCropState.cropId === crop.id && !selectedCropState.customName;
                return (
                  <button
                    key={crop.id}
                    onClick={() => handleSelect(crop.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-950/50'
                        : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{crop.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{crop.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {crop.idealSoilMoistureMin}-{crop.idealSoilMoistureMax}% Moist
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}

              {/* "Other" Option */}
              <button
                onClick={() => handleSelect('other')}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  selectedCropState.cropId === 'other'
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                    : 'bg-slate-800/30 border-dashed border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <p className="font-semibold text-sm">Other Crop</p>
                    <p className="text-[11px] text-slate-400">Custom crop name</p>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Current Active Crop: <strong className="text-emerald-400">{selectedCropState.customName || selectedCropState.cropId.toUpperCase()}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
