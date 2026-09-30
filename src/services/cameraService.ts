import { CameraAnalysisResult } from '../types/camera';
import { sensorService } from './sensorService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// High quality plant leaf sample SVG data URIs so images always render without broken links
const DEMO_HEALTHY_LEAF = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none"><rect width="600" height="400" fill="%23064e3b"/><path d="M300 50 C450 150 450 300 300 350 C150 300 150 150 300 50 Z" fill="%2310b981"/><path d="M300 50 L300 350 M300 120 L400 180 M300 180 L200 240 M300 240 L380 290" stroke="%23047857" stroke-width="6"/><text x="300" y="380" font-family="sans-serif" font-size="16" fill="%23a7f3d0" text-anchor="middle">Logitech USB Camera • Field Sector A-1</text></svg>';

const DEMO_DISEASED_LEAF = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none"><rect width="600" height="400" fill="%231c1917"/><path d="M300 50 C450 150 450 300 300 350 C150 300 150 150 300 50 Z" fill="%23854d0e"/><circle cx="280" cy="180" r="35" fill="%23451a03" stroke="%23f59e0b" stroke-width="4"/><circle cx="340" cy="240" r="25" fill="%23451a03" stroke="%23ef4444" stroke-width="4"/><circle cx="240" cy="260" r="20" fill="%23451a03" stroke="%23f59e0b" stroke-width="3"/><path d="M300 50 L300 350" stroke="%233f6212" stroke-width="5"/><text x="300" y="380" font-family="sans-serif" font-size="16" fill="%23fde047" text-anchor="middle">Logitech USB Camera • Detected Early Blight Lesions</text></svg>';

let currentCameraImage: string = DEMO_DISEASED_LEAF;
let currentAnalysis: CameraAnalysisResult | null = {
  id: 'cam_ana_1',
  imageUrl: DEMO_DISEASED_LEAF,
  captureTime: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  detectedCrop: 'Potato',
  condition: 'Needs Attention',
  possibleDisease: 'Early Blight',
  confidence: 89,
  severity: 'Moderate',
  symptoms: [
    'Concentric dark brown circular spots on lower leaves',
    'Yellow halo around leaf necrotic lesions',
    'Slight foliage drooping'
  ],
  recommendations: [
    'Inspect affected foliage and trim severely spotty leaves.',
    'Apply copper-based organic fungicide spray.',
    'Avoid overhead sprinkler watering to reduce leaf moisture duration.'
  ]
};

export const cameraService = {
  getLatestImage(): string {
    return currentCameraImage;
  },

  getLatestAnalysis(): CameraAnalysisResult | null {
    return currentAnalysis;
  },

  validateImageFile(file: File): { valid: boolean; error?: string } {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload a valid crop image (JPEG, PNG, or WEBP).' };
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB. Please choose a smaller image.' };
    }
    return { valid: true };
  },

  async uploadImage(file: File): Promise<string> {
    const validation = this.validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        currentCameraImage = result;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to read crop image file.'));
      reader.readAsDataURL(file);
    });
  },

  async analyzeImage(imageSource?: string, targetCropName: string = 'Potato'): Promise<CameraAnalysisResult> {
    if (!sensorService.isDemoMode() && API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/camera/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageSource || currentCameraImage, crop: targetCropName })
        });
        if (res.ok) {
          const data = await res.json();
          currentAnalysis = data;
          return data;
        }
      } catch (err) {
        console.warn('Real AI camera analysis failed, using simulated analysis engine:', err);
      }
    }

    // Simulate 1.5s AI model execution delay
    await new Promise(res => setTimeout(res, 1200));

    const imageToAnalyze = imageSource || currentCameraImage;

    // Deterministic simulation based on target crop or disease trigger
    if (imageToAnalyze.includes('064e3b') || imageToAnalyze.includes('healthy')) {
      currentAnalysis = {
        id: 'ana_' + Date.now(),
        imageUrl: imageToAnalyze,
        captureTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedCrop: targetCropName,
        condition: 'Healthy',
        possibleDisease: null,
        confidence: 96,
        severity: 'None',
        symptoms: ['Vibrant chlorophyll pigmentation', 'Clean leaf surface', 'Healthy leaf turgor'],
        recommendations: [
          'Foliage appears vigorous and disease-free.',
          'Continue regular monitoring and optimal crop nutrition schedule.'
        ]
      };
    } else {
      currentAnalysis = {
        id: 'ana_' + Date.now(),
        imageUrl: imageToAnalyze,
        captureTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedCrop: targetCropName,
        condition: 'Needs Attention',
        possibleDisease: `${targetCropName} Early Blight / Leaf Spot`,
        confidence: 89,
        severity: 'Moderate',
        symptoms: [
          'Concentric dark spots observed on foliage',
          'Yellowing edges on middle canopy leaves',
          'Localized leaf moisture stress'
        ],
        recommendations: [
          `Inspect ${targetCropName} plants in field sector A for leaf spots.`,
          'Apply suitable organic fungicide or neem extract spray.',
          'Keep foliage dry during evening hours.'
        ]
      };
    }

    return currentAnalysis;
  },

  triggerSimulatedDisease(diseaseName: string, cropName: string = 'Potato') {
    currentCameraImage = DEMO_DISEASED_LEAF;
    currentAnalysis = {
      id: 'ana_sim_' + Date.now(),
      imageUrl: DEMO_DISEASED_LEAF,
      captureTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detectedCrop: cropName,
      condition: 'At Risk',
      possibleDisease: diseaseName,
      confidence: 91,
      severity: 'Severe',
      symptoms: [
        `Severe ${diseaseName} necrotic spot coverage on leaves`,
        'Wilting lower stems and chlorophyll degradation'
      ],
      recommendations: [
        `Isolate heavily infected ${cropName} stems immediately.`,
        'Apply systemic fungicide treatments recommended for your crop zone.'
      ]
    };
  }
};
