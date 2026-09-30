export interface CameraAnalysisResult {
  id: string;
  imageUrl: string;
  captureTime: string;
  detectedCrop: string;
  condition: 'Healthy' | 'Needs Attention' | 'At Risk' | 'Critical';
  possibleDisease: string | null;
  confidence: number; // 0 - 100
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Unknown';
  symptoms: string[];
  recommendations: string[];
  isLowConfidence?: boolean;
}
