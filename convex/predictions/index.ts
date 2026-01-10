/**
 * Predictions module barrel exports
 */

// Types
export type {
  RiskLevel,
  TrendDirection,
  ConfidenceLevel,
  AtRiskHabit,
  HabitPrediction,
  DayPrediction,
  SevenDayPrediction,
} from './types';

// Helpers
export { calculateTrend, calculateRisk } from './helpers';

// Suggestions
export { generateSuggestions } from './suggestions';

// Day prediction helpers
export {
  generateDayPredictions,
  calculateOverallConfidence,
} from './dayPredictions';
