/**
 * Prediction suggestions generator
 *
 * Generates actionable suggestions based on risk level, strength, and trend.
 */

import { RiskLevel, TrendDirection } from './types';

/**
 * Generate actionable suggestions based on risk level, strength, and trend
 */
export function generateSuggestions(
  riskLevel: RiskLevel,
  strength: number,
  trend: TrendDirection
): string[] {
  if (riskLevel === 'high') {
    return [
      'Track this habit daily for the next 7 days to build momentum',
      'Set a specific time and place to perform this habit',
      'Start with a smaller, more achievable version of the habit',
      'Review what barriers are preventing consistent completion',
    ];
  }

  if (riskLevel === 'medium') {
    if (trend === 'declining') {
      return [
        'Your consistency has dropped recently - recommit for the next 3 days',
        'Identify what changed and adjust your approach',
        'Add environmental cues to trigger the habit',
      ];
    }

    return [
      'Maintain your current consistency to strengthen the habit',
      'Consider adding environmental cues or triggers',
      'Track completion times to identify patterns',
    ];
  }

  // Low risk suggestions
  if (trend === 'improving') {
    return [
      'Excellent progress! Keep up the momentum',
      'Reflect on what strategies have been working',
      'Consider helping others build similar habits',
    ];
  }

  return [
    'Keep up the excellent work - your habit is strong!',
    'Reflect on what made this habit successful',
    'Consider applying these strategies to other habits',
  ];
}
