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
  | 'financial'
  | 'health_fitness'
  | 'learning'
  | 'longevity'
  | 'mental_health'
  | 'mindfulness'
  | 'morning_routine'
  | 'productivity'
  | 'recovery'
  | 'sleep'
  | 'social';

/**
 * Difficulty level
 */
export type TemplateDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Seasonal collection
 */
export type SeasonalCollection = 'new_year' | 'summer' | 'study' | 'fall' | 'winter';

/**
 * Habit template type for marketplace templates
 */
export type HabitTemplate = {
  name: string;
  description?: string;
  frequency: string;
  icon: string;
  iconColor: string;
  cueTime?: string;
  cueLocation?: string;
  cueAfterBehavior?: string;
  tips?: string[];
  identity?: string;
  why?: string;
};

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
  // Marketplace fields
  difficulty?: TemplateDifficulty;
  estimatedTime?: number;
  featured?: boolean;
  seasonalCollection?: SeasonalCollection;
  habits?: HabitTemplate[];
  averageRating?: number;
  ratingCount?: number;
  collections?: string[];
  isMarketplaceTemplate?: boolean;
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
  v.literal('breathing')
);

/**
 * Convex validator for difficulty field
 */
export const difficultyValidator = v.union(
  v.literal('easy'),
  v.literal('medium'),
  v.literal('hard')
);

/**
 * Convex validator for seasonal collection field
 */
export const seasonalCollectionValidator = v.union(
  v.literal('new_year'),
  v.literal('summer'),
  v.literal('study'),
  v.literal('fall'),
  v.literal('winter')
);

/**
 * Convex validator for habit template
 */
export const habitTemplateValidator = v.object({
  name: v.string(),
  description: v.optional(v.string()),
  frequency: v.string(),
  icon: v.string(),
  iconColor: v.string(),
  cueTime: v.optional(v.string()),
  cueLocation: v.optional(v.string()),
  cueAfterBehavior: v.optional(v.string()),
  tips: v.optional(v.array(v.string())),
  identity: v.optional(v.string()),
  why: v.optional(v.string()),
});
