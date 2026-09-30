export interface CropConfig {
  id: string;
  name: string;
  icon: string;
  idealSoilMoistureMin: number; // in %
  idealSoilMoistureMax: number; // in %
  idealTemperatureMin: number; // in °C
  idealTemperatureMax: number; // in °C
  idealHumidityMin: number;    // in %
  idealHumidityMax: number;    // in %
  irrigationGuidance: string;
  commonDiseases: string[];
  basicRecommendations: string[];
}

export interface SelectedCropState {
  cropId: string;
  customName?: string;
  plantingDate?: string;
  growthStage?: 'Seedling' | 'Vegetative' | 'Flowering' | 'Yielding';
}
