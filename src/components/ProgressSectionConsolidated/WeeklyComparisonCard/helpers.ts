/**
 * Helper functions for WeeklyComparisonCard
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import type { TrendStyle } from './types';

/**
 * Get trend color and icon based on rate change.
 * Returns hex color values for theme-aware inline styles.
 * Accepts optional theme colors for the neutral (no change) state.
 */
export function getTrendStyle(
  rateChange: number,
  themeColors?: { bgNeutral: string; textNeutral: string; successBg?: string; successText?: string }
): TrendStyle {
  if (rateChange > 0) {
    return {
      bgColor: themeColors?.successBg ?? '#ecfdf5',
      icon: TrendingUp,
      label: 'improvement',
      textColor: themeColors?.successText ?? '#059669',
    };
  } else if (rateChange < 0) {
    return {
      bgColor: '#fef2f2', // red-50
      icon: TrendingDown,
      label: 'decline',
      textColor: '#ef4444', // red-500
    };
  }
  return {
    bgColor: themeColors?.bgNeutral ?? '#fafaf9',
    icon: Minus,
    label: 'no change',
    textColor: themeColors?.textNeutral ?? '#78716c',
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
