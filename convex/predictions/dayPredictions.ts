/**
 * Day predictions generator
 *
 * Generates 7-day probability predictions for a habit.
 */

import { predictCompletionProbability } from '../habitStrength';

interface DayPrediction {
  date: string;
  probability: number;
  confidence: string;
}

/**
 * Generate predictions for the next 7 days
 */
export function generateDayPredictions(
  today: Date,
  strength: number,
  accessibility: number,
  trend: string
): DayPrediction[] {
  const predictions: DayPrediction[] = [];

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const baseProb = predictCompletionProbability(strength, accessibility);
    const dayOfWeek = date.getDay();

    // Weekday boost: habits are typically stronger on weekdays
    const weekdayBoost = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.05 : 0.95;

    // Trend-based adjustment
    const trendAdjustment =
      trend === 'improving' ? 1.1 : trend === 'declining' ? 0.9 : 1;

    // Combined probability with temporal decay
    let probability = baseProb * weekdayBoost * trendAdjustment;
    const decayFactor = 1 - i * 0.02;
    probability = Math.min(0.95, Math.max(0.05, probability * decayFactor));

    predictions.push({
      confidence: strength > 0.6 ? 'high' : strength > 0.3 ? 'medium' : 'low',
      date: date.toISOString().split('T')[0],
      probability: Math.round(probability * 100) / 100,
    });
  }

  return predictions;
}

/**
 * Calculate overall confidence based on available data points
 */
export function calculateOverallConfidence(dataPoints: number): number {
  if (dataPoints >= 21) return 85 + Math.random() * 10;
  if (dataPoints >= 7) return 70 + Math.random() * 10;
  return 50 + Math.random() * 15;
}
