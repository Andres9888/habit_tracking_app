import type { Doc } from '../../../../../convex/_generated/dataModel';

export type StylePreference = 'gentle' | 'challenging' | 'either';
export type TimeBucket = 'micro' | 'steady' | 'deep' | 'any';

export interface RecommendationInput {
  selectedCategories: string[];
  selectedGoalIds?: string[];
  timeBucket?: TimeBucket;
  stylePreference?: StylePreference;
  limit?: number;
}

export interface RecommendationReason {
  key: 'category' | 'goal' | 'time' | 'style' | 'evidence' | 'adherence' | 'popularity';
  label: string;
  contribution: number;
}

export interface RankedTemplate {
  template: Doc<'templates'>;
  score: number;
  reasons: RecommendationReason[];
  whyThisMatches: string;
}
