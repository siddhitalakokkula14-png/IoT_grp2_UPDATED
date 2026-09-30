import { CropConfig } from '../types/crop';

export const DEFAULT_CROPS: CropConfig[] = [
  {
    id: 'potato',
    name: 'Potato',
    icon: '🥔',
    idealSoilMoistureMin: 50,
    idealSoilMoistureMax: 70,
    idealTemperatureMin: 15,
    idealTemperatureMax: 24,
    idealHumidityMin: 60,
    idealHumidityMax: 80,
    irrigationGuidance: 'Keep soil consistently moist, especially during tuber initiation and swelling phases. Avoid waterlogging.',
    commonDiseases: ['Early Blight', 'Late Blight', 'Blackleg', 'Potato Virus Y'],
    basicRecommendations: [
      'Maintain soil moisture between 50% and 70% during tuber development.',
      'Ensure proper soil aeration to prevent bacterial soft rot.',
      'Apply nitrogen fertilizer in split doses for optimal yield.'
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato',
    icon: '🍅',
    idealSoilMoistureMin: 60,
    idealSoilMoistureMax: 80,
    idealTemperatureMin: 18,
    idealTemperatureMax: 29,
    idealHumidityMin: 50,
    idealHumidityMax: 70,
    irrigationGuidance: 'Deep, regular watering at the base. Avoid leaf wetness to prevent fungal diseases.',
    commonDiseases: ['Tomato Leaf Curl', 'Early Blight', 'Bacterial Spot', 'Fusarium Wilt'],
    basicRecommendations: [
      'Avoid overhead irrigation to minimize leaf moisture and blight.',
      'Maintain consistent moisture to prevent blossom end rot.',
      'Provide sturdy staking or trellising for support.'
    ]
  },
  {
    id: 'onion',
    name: 'Onion',
    icon: '🧅',
    idealSoilMoistureMin: 45,
    idealSoilMoistureMax: 65,
    idealTemperatureMin: 12,
    idealTemperatureMax: 25,
    idealHumidityMin: 50,
    idealHumidityMax: 65,
    irrigationGuidance: 'Shallow root system requires frequent light irrigation. Stop watering 2-3 weeks before harvest.',
    commonDiseases: ['Downy Mildew', 'Purple Blotch', 'Onion Smut', 'Thrips Infestation'],
    basicRecommendations: [
      'Irrigate frequently with low water volume due to shallow roots.',
      'Reduce irrigation during bulb maturation phase.',
      'Keep weed-free to maximize soil nutrient access.'
    ]
  },
  {
    id: 'rice',
    name: 'Rice',
    icon: '🌾',
    idealSoilMoistureMin: 75,
    idealSoilMoistureMax: 95,
    idealTemperatureMin: 20,
    idealTemperatureMax: 35,
    idealHumidityMin: 70,
    idealHumidityMax: 90,
    irrigationGuidance: 'Requires standing water or alternate wetting and drying depending on variety.',
    commonDiseases: ['Rice Blast', 'Bacterial Blight', 'Sheath Blight', 'Brown Spot'],
    basicRecommendations: [
      'Maintain standing water of 2-5 cm during tillering.',
      'Drain fields 10 days before harvesting.',
      'Monitor for stem borer and blast symptoms regularly.'
    ]
  },
  {
    id: 'wheat',
    name: 'Wheat',
    icon: '🌾',
    idealSoilMoistureMin: 40,
    idealSoilMoistureMax: 60,
    idealTemperatureMin: 12,
    idealTemperatureMax: 23,
    idealHumidityMin: 45,
    idealHumidityMax: 65,
    irrigationGuidance: 'Critical watering stages: Crown root initiation, flowering, and grain filling.',
    commonDiseases: ['Yellow Rust', 'Brown Rust', 'Powdery Mildew', 'Karnal Bunt'],
    basicRecommendations: [
      'Ensure irrigation during crown root initiation (21 days post sowing).',
      'Avoid excess moisture during flowering to reduce rust risk.',
      'Apply potassium fertilizer to build drought tolerance.'
    ]
  },
  {
    id: 'maize',
    name: 'Maize',
    icon: '🌽',
    idealSoilMoistureMin: 50,
    idealSoilMoistureMax: 70,
    idealTemperatureMin: 18,
    idealTemperatureMax: 32,
    idealHumidityMin: 50,
    idealHumidityMax: 75,
    irrigationGuidance: 'High water requirement during tasseling and silking stages.',
    commonDiseases: ['Fall Armyworm', 'Turcicum Leaf Blight', 'Maydis Blight', 'Stalk Rot'],
    basicRecommendations: [
      'Maintain adequate moisture during critical tasseling stage.',
      'Monitor fields early for Fall Armyworm larvae.',
      'Ensure good soil drainage to prevent root asphyxiation.'
    ]
  },
  {
    id: 'cotton',
    name: 'Cotton',
    icon: '☁️',
    idealSoilMoistureMin: 45,
    idealSoilMoistureMax: 65,
    idealTemperatureMin: 21,
    idealTemperatureMax: 35,
    idealHumidityMin: 40,
    idealHumidityMax: 60,
    irrigationGuidance: 'Critical period is boll development. Avoid heavy late-season irrigation.',
    commonDiseases: ['Cotton Leaf Curl', 'Bacterial Blight', 'Verticillium Wilt', 'Bollworm'],
    basicRecommendations: [
      'Schedule drip irrigation during peak boll formation.',
      'Stop irrigation when bolls begin to open.',
      'Monitor yellow sticky traps for whitefly vectors.'
    ]
  },
  {
    id: 'soybean',
    name: 'Soybean',
    icon: '🫘',
    idealSoilMoistureMin: 50,
    idealSoilMoistureMax: 70,
    idealTemperatureMin: 20,
    idealTemperatureMax: 30,
    idealHumidityMin: 55,
    idealHumidityMax: 75,
    irrigationGuidance: 'Water stress during pod elongation and seed fill reduces yield drastically.',
    commonDiseases: ['Soybean Rust', 'Frog Eye Leaf Spot', 'Yellow Mosaic Virus'],
    basicRecommendations: [
      'Ensure moisture adequacy from flowering through pod fill.',
      'Inoculate seeds with Rhizobium for optimal nitrogen fixation.',
      'Inspect lower canopy leaves for early rust pustules.'
    ]
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    icon: '🎋',
    idealSoilMoistureMin: 60,
    idealSoilMoistureMax: 80,
    idealTemperatureMin: 24,
    idealTemperatureMax: 38,
    idealHumidityMin: 60,
    idealHumidityMax: 85,
    irrigationGuidance: 'Heavy water consumer. High frequency trash mulching helps conserve moisture.',
    commonDiseases: ['Red Rot', 'Smut', 'Wilt', 'Grassy Shoot'],
    basicRecommendations: [
      'Irrigate every 8-10 days during grand growth phase.',
      'Use trash mulching to retain soil moisture and control weeds.',
      'Withhold water 15-20 days prior to harvest to boost sucrose concentration.'
    ]
  },
  {
    id: 'chilli',
    name: 'Chilli',
    icon: '🌶️',
    idealSoilMoistureMin: 45,
    idealSoilMoistureMax: 65,
    idealTemperatureMin: 20,
    idealTemperatureMax: 32,
    idealHumidityMin: 50,
    idealHumidityMax: 70,
    irrigationGuidance: 'Sensitive to waterlogging and severe drought. Maintain uniform moisture.',
    commonDiseases: ['Chilli Leaf Curl', 'Anthracnose', 'Powdery Mildew', 'Damping Off'],
    basicRecommendations: [
      'Prevent water stagnation to avoid root rot.',
      'Spray micronutrients during flowering stage.',
      'Use shade nets during intense summer heat.'
    ]
  },
  {
    id: 'brinjal',
    name: 'Brinjal',
    icon: '🍆',
    idealSoilMoistureMin: 55,
    idealSoilMoistureMax: 75,
    idealTemperatureMin: 22,
    idealTemperatureMax: 33,
    idealHumidityMin: 55,
    idealHumidityMax: 75,
    irrigationGuidance: 'Regular irrigation required to keep fruits succulent and prevent bitterness.',
    commonDiseases: ['Fruit and Shoot Borer', 'Phomopsis Blight', 'Little Leaf of Brinjal'],
    basicRecommendations: [
      'Maintain steady soil moisture throughout fruiting.',
      'Pinch off infected shoots damaged by borer larvae.',
      'Apply organic mulch around plant basins.'
    ]
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    icon: '🥬',
    idealSoilMoistureMin: 60,
    idealSoilMoistureMax: 80,
    idealTemperatureMin: 15,
    idealTemperatureMax: 22,
    idealHumidityMin: 60,
    idealHumidityMax: 80,
    irrigationGuidance: 'Continuous moist conditions prevent head splitting.',
    commonDiseases: ['Black Rot', 'Clubroot', 'Downy Mildew', 'Diamondback Moth'],
    basicRecommendations: [
      'Keep moisture level stable during head formation to avoid splitting.',
      'Practice crop rotation with non-cruciferous crops.',
      'Apply neem-based sprays for caterpillar management.'
    ]
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    icon: '🥦',
    idealSoilMoistureMin: 60,
    idealSoilMoistureMax: 80,
    idealTemperatureMin: 15,
    idealTemperatureMax: 24,
    idealHumidityMin: 60,
    idealHumidityMax: 80,
    irrigationGuidance: 'Sensitive to moisture stress during curd development.',
    commonDiseases: ['Curd Rot', 'Black Rot', 'Alternaria Blight'],
    basicRecommendations: [
      'Blanch curds by tying outer leaves over curds to maintain white color.',
      'Ensure uninterrupted irrigation during curd enlargement.',
      'Apply boron fertilizer to prevent hollow stem.'
    ]
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    icon: '🥜',
    idealSoilMoistureMin: 40,
    idealSoilMoistureMax: 60,
    idealTemperatureMin: 22,
    idealTemperatureMax: 30,
    idealHumidityMin: 45,
    idealHumidityMax: 65,
    irrigationGuidance: 'Critical irrigation phases: Flowering, pegging, and pod development.',
    commonDiseases: ['Tikka Leaf Spot', 'Rust', 'Collar Rot', 'Aflatoxin Contamination'],
    basicRecommendations: [
      'Ensure friable soil during peg entry phase.',
      'Avoid heavy irrigation during harvesting to keep pods clean.',
      'Apply gypsum at flowering to improve pod filling.'
    ]
  }
];

export function getCropConfig(cropId: string, customName?: string): CropConfig {
  const found = DEFAULT_CROPS.find(c => c.id === cropId.toLowerCase());
  if (found) return found;

  const displayName = customName || cropId || 'Custom Crop';
  return {
    id: 'other',
    name: displayName,
    icon: '🌱',
    idealSoilMoistureMin: 50,
    idealSoilMoistureMax: 70,
    idealTemperatureMin: 18,
    idealTemperatureMax: 28,
    idealHumidityMin: 50,
    idealHumidityMax: 75,
    irrigationGuidance: `Maintain moderate soil moisture and regular monitoring for ${displayName}.`,
    commonDiseases: ['General Leaf Blight', 'Root Rot', 'Pest Damage'],
    basicRecommendations: [
      `Keep soil moisture between 50% and 70% for ${displayName}.`,
      `Monitor daily temperature and humidity levels.`,
      `Inspect leaves regularly for fungal or insect activity.`
    ]
  };
}
