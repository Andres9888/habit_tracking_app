/**
 * Helper functions for delta value formatting and rendering.
 * Extracted from StrengthInsightsRow.
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';

// WCAG AA compliant colors (4.5:1 minimum contrast ratio)
export const DELTA_COLORS = {
  // Emerald-700 (WCAG AA: 5.48:1)
  negative: '#dc2626',
  // Red-600 (WCAG AA: 4.83:1)
  neutral: '#78716c',
  positive: '#047857', // Stone-500 (WCAG AA: 4.80:1)
} as const;

const DELTA_ICON_SIZE = iconSizes.medium;

/**
 * Get the appropriate icon for the delta value
 */
export function getDeltaIcon(delta: number): React.ReactNode {
  if (delta > 0) {
    return React.createElement(TrendingUp, {
      color: DELTA_COLORS.positive,
      size: DELTA_ICON_SIZE,
      testID: 'icon-trending-up',
    });
  }
  if (delta < 0) {
    return React.createElement(TrendingDown, {
      color: DELTA_COLORS.negative,
      size: DELTA_ICON_SIZE,
      testID: 'icon-trending-down',
    });
  }
  return React.createElement(Minus, {
    color: DELTA_COLORS.neutral,
    size: DELTA_ICON_SIZE,
    testID: 'icon-minus',
  });
}

/**
 * Get the color for the delta value text
 */
export function getDeltaColor(delta: number): string {
  if (delta > 0) return DELTA_COLORS.positive;
  if (delta < 0) return DELTA_COLORS.negative;
  return DELTA_COLORS.neutral;
}

/**
 * Format the delta value with sign and percentage
 */
export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta.toFixed(0)}%`;
  if (delta < 0) return `${delta.toFixed(0)}%`;
  return '0%';
}
