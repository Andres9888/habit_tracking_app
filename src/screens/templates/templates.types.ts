/**
 * Templates Screen Types
 */

export type SortOption = 'az' | 'popular';

export interface SortOptionConfig {
  description: string;
  label: string;
  value: SortOption;
}

export type Category =
  | 'all'
  | 'andrew_huberman'
  | 'breathing'
  | 'creativity'
  | 'environmental_design'
  | 'financial'
  | 'health_fitness'
  | 'high-roi'
  | 'learning'
  | 'longevity'
  | 'mental_health'
  | 'mindfulness'
  | 'morning_routine'
  | 'productivity'
  | 'quick'
  | 'recovery'
  | 'sleep'
  | 'social'
  | 'subtraction';

export interface CategoryFilter {
  icon: string;
  id: Category;
  label: string;
}

export type CategoryColorTokens = {
  bg: string;
  bgSelected: string;
  border: string;
  text: string;
};
