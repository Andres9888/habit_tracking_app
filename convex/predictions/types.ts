/**
 * Predictions types
 *
 * Type definitions for prediction queries and calculations.
 */

import { Id } from '../_generated/dataModel';

export type RiskLevel = 'low' | 'medium' | 'high';
export type TrendDirection = 'improving' | 'stable' | 'declining';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

/**
 * Habit identified as at-risk of being abandoned
 * Contains current metrics and predicted failure probability
 */
export interface AtRiskHabit {
  _id: Id<'habits'>;
  name: string;
  icon: string;
  strength: number;
  accessibility: number;
  predictedProbability: number;
  riskLevel: 'high' | 'medium';
}

/**
 * Prediction data for a single habit
 * Includes strength, accessibility, failure probability, and confidence metrics
 */
export interface HabitPrediction {
  habitId: Id<'habits'>;
  habitName: string;
  strength: number;
  accessibility: number;
  predictedProbability: number;
  confidence: number;
  riskLevel: RiskLevel;
}

/**
 * Daily completion prediction for a habit
 * Predicts probability of completion on a specific date
 */
export interface DayPrediction {
  date: string;
  probability: number;
  confidence: string;
}

export interface SevenDayPrediction {
  habitId: Id<'habits'>;
  currentStrength: number;
  predictedStrength: number;
  confidence: number;
  riskLevel: string;
  trend: string;
  predictions: DayPrediction[];
  suggestions: string[];
}
