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
  | 'sleep'
  | 'social'
  | 'subtraction';

/**
 * Template insert type for database operations
 */
export type GrowthType = 'simple' | 'average' | 'complex';

/** "What you'll feel" benefit row in the science drill-down. */
export type BenefitDetail = {
  icon: string;
  title: string;
  description: string;
};

/** "What to expect" progression node; `peak` marks the automaticity milestone. */
export type TimelineEntry = {
  when: string;
  title: string;
  description: string;
  peak?: boolean;
};

/** A single cited research source in "The research". */
export type ScienceSource = {
  authors: string;
  title: string;
  journal: string;
  year: string;
  link?: string;
};

/**
 * Authored science drill-down content for one template. Every field is
 * optional: the UI renders each section only when its data is present, so
 * partially-authored templates degrade cleanly. See
 * `scienceEnrichment.data.ts` for the authoring rules (notably: never invent
 * a citation).
 */
export type ScienceEnrichment = {
  tagline?: string;
  lead?: string;
  evidence?: string;
  cadenceLabel?: string;
  benefitDetails?: BenefitDetail[];
  timeline?: TimelineEntry[];
  howToStart?: string[];
  sources?: ScienceSource[];
};

export type TemplateInsert = {
  benefits?: string[];
  category: TemplateCategory;
  createdAt: number;
  description: string;
  estimatedMinutes?: number;
  frequency: string;
  growthType?: GrowthType;
  icon: string;
  iconColor: string;
  name: string;
  isPremium?: boolean;
  popularityScore?: number;
  scientificLink?: string;
  scientificReference: string;
  startSmallVersion?: string;
  tips?: string[];
  youtubeLink?: string;
  // Science drill-down (all optional)
  tagline?: string;
  lead?: string;
  evidence?: string;
  cadenceLabel?: string;
  benefitDetails?: BenefitDetail[];
  timeline?: TimelineEntry[];
  howToStart?: string[];
  sources?: ScienceSource[];
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
  v.literal('environmental_design'),
  v.literal('subtraction')
);
