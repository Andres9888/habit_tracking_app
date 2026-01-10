/**
 * Predictions types
 *
 * Type definitions for prediction queries and calculations.
 */

import { Id } from '../_generated/dataModel';

export type RiskLevel = 'low' | 'medium' | 'high';
export type TrendDirection = 'improving' | 'stable' | 'declining';
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface AtRiskHabit {
  _id: Id<'habits'>;
  name: string;
  icon: string;
  strength: number;
  accessibility: number;
  predictedProbability: number;
  riskLevel: 'high' | 'medium';
}

export interface HabitPrediction {
  habitId: Id<'habits'>;
  habitName: string;
  strength: number;
  accessibility: number;
  predictedProbability: number;
  confidence: number;
  riskLevel: RiskLevel;
}

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
