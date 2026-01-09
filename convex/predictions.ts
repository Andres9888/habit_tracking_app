/**
 * Predictions Module - Phase 4: Retention Engine
 *
 * Behavioral prediction system for proactive interventions.
 * Based on habit strength and accessibility calculations.
 *
 * References:
 * - Klein et al. (2011): Habit strength prediction model
 * - Zhang et al. (2021): Memory accessibility decay
 *
 * Decomposed structure:
 * - predictions/ - Types, helpers, suggestions generator
 * - predictionsAtRisk.ts - At-risk habit queries
 * - predictions7Day.ts - 7-day prediction query
 */

// Re-export types and helpers
export type {
  RiskLevel,
  TrendDirection,
  ConfidenceLevel,
  AtRiskHabit,
  HabitPrediction,
  DayPrediction,
  SevenDayPrediction,
} from './predictions/index';

export {
  calculateTrend,
  calculateRisk,
  generateSuggestions,
} from './predictions/index';

// At-risk queries
export { getHabitsAtRisk, getHabitPrediction } from './predictionsAtRisk';

// 7-day prediction query
export { predict7Days } from './predictions7Day';
