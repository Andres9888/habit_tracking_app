/**
 * Helper functions for WeeklyComparisonCard
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import type { TrendStyle } from './types';

/**
 * Get trend style based on rate change.
 * Returns both light and dark color values so the badge renders correctly in either mode.
 */
export function getTrendStyle(rateChange: number): TrendStyle {
  if (rateChange > 0) {
    return {
      bgColorDark: 'rgba(5,150,105,0.18)',
      bgColorLight: '#ECFDF5',
      icon: TrendingUp,
      iconColorDark: '#6EE7B7',
      iconColorLight: '#059669',
      label: 'improvement',
      textColorDark: '#6EE7B7',
      textColorLight: '#059669',
    };
  } else if (rateChange < 0) {
    return {
      bgColorDark: 'rgba(239,68,68,0.18)',
      bgColorLight: '#FEF2F2',
      icon: TrendingDown,
      iconColorDark: '#FCA5A5',
      iconColorLight: '#EF4444',
      label: 'decline',
      textColorDark: '#FCA5A5',
      textColorLight: '#EF4444',
    };
  }
  return {
    bgColorDark: 'rgba(120,113,108,0.18)',
    bgColorLight: '#FAFAF9',
    icon: Minus,
    iconColorDark: '#A8A29E',
    iconColorLight: '#78716C',
    label: 'no change',
    textColorDark: '#A8A29E',
    textColorLight: '#78716C',
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
