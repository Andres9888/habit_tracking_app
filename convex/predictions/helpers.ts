/**
 * Predictions calculation helpers
 *
 * Functions for calculating trend, risk level, and generating suggestions.
 */

import { TrendDirection, RiskLevel } from './types';

/**
 * Calculate trend direction based on strength and recent performance
 */
export function calculateTrend(
  strength: number,
  recentCompletions: number,
  previousCompletions: number
): TrendDirection {
  const recentRate = recentCompletions / 7;
  const previousRate = previousCompletions / 7;

  // If strength is high and stable, consider it stable
  if (strength >= 0.7 && Math.abs(recentRate - previousRate) < 0.15) {
    return 'stable';
  }

  // If recent performance is significantly better
  if (recentRate > previousRate + 0.15) {
    return 'improving';
  }

  // If recent performance is significantly worse
  if (recentRate < previousRate - 0.15) {
    return 'declining';
  }

  return 'stable';
}

/**
 * Calculate risk level based on strength and recent completions
 */
export function calculateRisk(
  strength: number,
  recentCompletions: number
): RiskLevel {
  const recentRate = recentCompletions / 7;

  // High risk: Low strength or very low recent completion rate
  if (strength < 0.3 || recentRate < 0.3) {
    return 'high';
  }

  // Medium risk: Moderate strength or declining performance
  if (strength < 0.6 || recentRate < 0.6) {
    return 'medium';
  }

  return 'low';
}
