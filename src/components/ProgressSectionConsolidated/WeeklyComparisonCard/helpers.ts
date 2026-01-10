/**
 * Helper functions for WeeklyComparisonCard
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import type { TrendStyle } from './types';

/**
 * Get trend color and icon based on rate change
 */
export function getTrendStyle(rateChange: number): TrendStyle {
  if (rateChange > 0) {
    return {
      bgColor: 'bg-emerald-50',
      icon: TrendingUp,
      label: 'improvement',
      textColor: 'text-emerald-600',
    };
  } else if (rateChange < 0) {
    return {
      bgColor: 'bg-red-50',
      icon: TrendingDown,
      label: 'decline',
      textColor: 'text-red-500',
    };
  }
  return {
    bgColor: 'bg-stone-50',
    icon: Minus,
    label: 'no change',
    textColor: 'text-stone-500',
  };
}

/**
 * Get encouraging message based on trend
 */
export function getMessage(rateChange: number, thisWeekRate: number): string {
  if (rateChange > 15) {
    return "Amazing progress! You're crushing it this week.";
  } else if (rateChange > 5) {
    return 'Great improvement! Keep the momentum going.';
  } else if (rateChange > 0) {
    return 'Slight improvement. Every bit counts!';
  } else if (rateChange === 0) {
    if (thisWeekRate >= 80) {
      return 'Maintaining excellent consistency!';
    }
    return 'Staying steady. Push for more next week!';
  } else if (rateChange > -10) {
    return 'Small dip. You can bounce back!';
  } else {
    return 'Tough week. Tomorrow is a fresh start.';
  }
}
