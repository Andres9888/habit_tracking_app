/**
 * Client-side heuristic to identify "simple" habits for anchoring effect.
 * Simple habits are daily, have short descriptions, and few tips.
 * Returns a score 0–100 where higher = simpler.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';

const DAILY_PATTERNS = /^daily$/i;
const SHORT_DESC_THRESHOLD = 80;
const FEW_TIPS_THRESHOLD = 3;

export function getSimplicityScore(template: Doc<'templates'>): number {
  let score = 0;

  // Daily frequency = simpler (40 points)
  if (DAILY_PATTERNS.test(template.frequency ?? '')) {
    score += 40;
  }

  // Short description = simpler (30 points)
  const descLength = template.description?.length ?? 0;
  if (descLength <= SHORT_DESC_THRESHOLD) {
    score += 30;
  } else if (descLength <= SHORT_DESC_THRESHOLD * 2) {
    score += 15;
  }

  // Few or no tips = simpler (30 points)
  const tipCount = template.tips?.length ?? 0;
  if (tipCount <= 1) {
    score += 30;
  } else if (tipCount <= FEW_TIPS_THRESHOLD) {
    score += 15;
  }

  return score;
}

/** Threshold above which a template is considered "simple" */
export const SIMPLE_THRESHOLD = 70;

export function isSimpleHabit(template: Doc<'templates'>): boolean {
  return getSimplicityScore(template) >= SIMPLE_THRESHOLD;
}
