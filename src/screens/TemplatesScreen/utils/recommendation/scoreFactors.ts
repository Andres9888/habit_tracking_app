import type { Doc } from '../../../../../convex/_generated/dataModel';
import type { RecommendationInput, RecommendationReason, StylePreference, TimeBucket } from './types';
import { GOAL_INTENT_TO_CATEGORIES } from './goalIntentCategories';

export const SCORING_WEIGHTS = {
  categoryExact: 45,
  categoryGoalIntent: 18,
  timeExact: 25,
  timeAdjacent: 12,
  timeMissing: 6,
  styleExact: 20,
  styleAdjacent: 12,
  evidence: 6,
  adherenceStartSmall: 3,
  adherenceCue: 2,
  adherenceIdentity: 1,
  popularityMax: 8,
} as const;

function getTimeBucket(minutes: number): TimeBucket {
  if (minutes <= 5) return 'micro';
  if (minutes <= 15) return 'steady';
  return 'deep';
}

export function scoreCategoryFit(
  t: Doc<'templates'>,
  input: Pick<RecommendationInput, 'selectedCategories' | 'selectedGoalIds'>
): { score: number; reason: RecommendationReason | null } {
  if (input.selectedCategories.includes(t.category)) {
    return { score: SCORING_WEIGHTS.categoryExact, reason: { key: 'category', label: `Matches your ${t.category.replace('_', ' ')} focus`, contribution: SCORING_WEIGHTS.categoryExact } };
  }
  const goalCategories = (input.selectedGoalIds ?? []).flatMap(
    (id) => GOAL_INTENT_TO_CATEGORIES[id] ?? []
  );
  if (goalCategories.includes(t.category)) {
    return { score: SCORING_WEIGHTS.categoryGoalIntent, reason: { key: 'goal', label: 'Supports your goal', contribution: SCORING_WEIGHTS.categoryGoalIntent } };
  }
  return { score: 0, reason: null };
}

export function scoreTimeFit(
  t: Doc<'templates'>,
  bucket: TimeBucket | undefined
): { score: number; reason: RecommendationReason | null } {
  if (!bucket || bucket === 'any') {
    return { score: SCORING_WEIGHTS.timeMissing, reason: null };
  }
  const mins = t.estimatedMinutes ?? 5;
  const tBucket = getTimeBucket(mins);
  if (tBucket === bucket) {
    return { score: SCORING_WEIGHTS.timeExact, reason: { key: 'time', label: `Fits your ${bucket} window`, contribution: SCORING_WEIGHTS.timeExact } };
  }
  const order: TimeBucket[] = ['micro', 'steady', 'deep'];
  const diff = Math.abs(order.indexOf(tBucket) - order.indexOf(bucket));
  if (diff === 1) {
    return { score: SCORING_WEIGHTS.timeAdjacent, reason: { key: 'time', label: 'Near your preferred time window', contribution: SCORING_WEIGHTS.timeAdjacent } };
  }
  return { score: 0, reason: null };
}

export function scoreStyleFit(
  t: Doc<'templates'>,
  style: StylePreference | undefined
): { score: number; reason: RecommendationReason | null } {
  if (!style || style === 'either') return { score: SCORING_WEIGHTS.styleAdjacent, reason: null };
  const growth = t.growthType ?? 'simple';
  const isGentle = growth === 'simple';
  if ((style === 'gentle' && isGentle) || (style === 'challenging' && !isGentle)) {
    return { score: SCORING_WEIGHTS.styleExact, reason: { key: 'style', label: `Matches your ${style} style`, contribution: SCORING_WEIGHTS.styleExact } };
  }
  return { score: 0, reason: null };
}

export function scoreEvidence(t: Doc<'templates'>): { score: number; reason: RecommendationReason | null } {
  if (t.scientificReference) {
    return { score: SCORING_WEIGHTS.evidence, reason: { key: 'evidence', label: 'Science-backed', contribution: SCORING_WEIGHTS.evidence } };
  }
  return { score: 0, reason: null };
}

export function scoreAdherence(t: Doc<'templates'>): { score: number; reason: RecommendationReason | null } {
  let score = 0;
  if (t.startSmallVersion) score += SCORING_WEIGHTS.adherenceStartSmall;
  if (t.suggestedCue) score += SCORING_WEIGHTS.adherenceCue;
  if (t.suggestedIdentity) score += SCORING_WEIGHTS.adherenceIdentity;
  return { score, reason: score > 0 ? { key: 'adherence', label: 'Easy to start', contribution: score } : null };
}

export function scorePopularity(t: Doc<'templates'>): { score: number; reason: RecommendationReason | null } {
  const pop = Math.min(t.popularityScore ?? 0, 100);
  const score = Math.round((pop / 100) * SCORING_WEIGHTS.popularityMax);
  return { score, reason: null };
}
