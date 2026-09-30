import { SelectedCropState, CropConfig } from '../types/crop';
import { getCropConfig } from '../data/cropConfig';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'smartagri_selected_crop';

const DEFAULT_STATE: SelectedCropState = {
  cropId: 'potato',
  plantingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  growthStage: 'Vegetative'
};

export const cropService = {
  getSelectedCropState(): SelectedCropState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse selected crop from local storage', e);
    }
    return DEFAULT_STATE;
  },

  async saveSelectedCropState(state: SelectedCropState): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

      if (isSupabaseConfigured && supabase) {
        await supabase.from('crops').upsert({
          crop_id: state.cropId,
          crop_name: state.customName || state.cropId,
          planting_date: state.plantingDate,
          growth_stage: state.growthStage || 'Vegetative',
          updated_at: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error('Error saving selected crop state:', e);
    }
  },

  getCurrentCropConfig(): CropConfig {
    const state = this.getSelectedCropState();
    return getCropConfig(state.cropId, state.customName);
  }
};
