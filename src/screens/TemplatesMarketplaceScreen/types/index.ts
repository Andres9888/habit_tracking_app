/**
 * Templates Marketplace Screen Types
 */

import type { Doc, Id } from '@/convex/_generated/dataModel';

/**
 * Template category filter
 */
export type CategoryFilter =
  | 'all'
  | 'fitness'
  | 'mindfulness'
  | 'productivity'
  | 'health';

/**
 * Difficulty filter
 */
export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

/**
 * Seasonal collection type
 */
export type SeasonalCollection = 'new_year' | 'summer' | 'study' | 'fall' | 'winter';

/**
 * Marketplace template card data
 */
export interface MarketplaceTemplateCardProps {
  template: Doc<'templates'>;
  onPress: () => void;
  onRate?: () => void;
  userRating?: number | null;
}

/**
 * Featured section data
 */
export interface FeaturedSectionData {
  templates: Doc<'templates'>[];
}

/**
 * Seasonal collection data
 */
export interface SeasonalCollectionData {
  name: string;
  icon: string;
  collection: SeasonalCollection;
  templates: Doc<'templates'>[];
}
