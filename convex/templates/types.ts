/**
 * Template types and validators
 */
import { v } from 'convex/values';

/**
 * Template category union type
 */
export type TemplateCategory =
  | 'andrew_huberman'
  | 'breathing'
  | 'creativity'
  | 'environmental_design'
  | 'financial'
  | 'health_fitness'
  | 'learning'
  | 'longevity'
  | 'mental_health'
  | 'mindfulness'
  | 'morning_routine'
  | 'productivity'
  | 'recovery'
  | 'relationships'
  | 'sleep'
  | 'social'
  | 'subtraction';

/**
 * Template insert type for database operations
 */
export type TemplateInsert = {
  category: TemplateCategory;
  createdAt: number;
  description: string;
  frequency: string;
  icon: string;
  iconColor: string;
  name: string;
  popularityScore?: number;
  scientificLink?: string;
  scientificReference: string;
  tips?: string[];
  youtubeLink?: string;
};

/**
 * Convex validator for category field
 */
export const categoryValidator = v.union(
  v.literal('morning_routine'),
  v.literal('health_fitness'),
  v.literal('productivity'),
  v.literal('mindfulness'),
  v.literal('andrew_huberman'),
  v.literal('learning'),
  v.literal('social'),
  v.literal('financial'),
  v.literal('creativity'),
  v.literal('sleep'),
  v.literal('longevity'),
  v.literal('mental_health'),
  v.literal('recovery'),
  v.literal('breathing'),
  v.literal('relationships'),
  v.literal('environmental_design'),
  v.literal('subtraction')
);
