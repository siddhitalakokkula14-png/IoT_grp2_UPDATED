export type RecommendationCategory =
  | 'water'
  | 'soil'
  | 'temperature'
  | 'humidity'
  | 'light'
  | 'crop-health'
  | 'disease'
  | 'general';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  priority: PriorityLevel;
  action: string;
  currentValue?: string;
  idealValue?: string;
  whyItMatters?: string;
  createdAt: string;
}
