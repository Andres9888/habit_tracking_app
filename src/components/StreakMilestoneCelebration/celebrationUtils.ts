/**
 * Celebration helper utilities — extracted to keep useCelebrationHandlers.ts
 * under the max-lines ESLint limit.
 */

import type { MilestoneLevel } from '../ShareCardGenerator/ShareCardGenerator.types';

/** Streak lengths that trigger the sentiment-gated review flow */
export const REVIEW_STREAK_DAYS = new Set([7, 14, 30]);

/** Build a contextual message for the review sentiment prompt */
export function buildStreakReviewMessage(days: number): string {
  return days === 7
    ? `You just hit a ${days}-day streak — you're building a real habit! 🎉`
    : `${days}-day streak achieved — you're unstoppable! 🔥`;
}

/** Map streak days to a share-card milestone level */
export function streakToMilestoneLevel(days: number): MilestoneLevel {
  if (days >= 100) return 'automatic';
  if (days >= 30) return 'strong';
  return 'developing';
}
