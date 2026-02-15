/**
 * HabitCard Utility Functions
 * Helper functions for strength-related calculations
 */

import type { AppTheme } from '../../theme';
import { getStrengthLevel } from '../HabitStrengthIndicator';

/**
 * Get the color associated with a habit's strength level
 */
export function getStrengthColor(strength: number, theme: AppTheme): string {
  const level = getStrengthLevel(strength);
  switch (level) {
    case 'starting': {
      return theme.custom.colors.strength.starting;
    }
    case 'building': {
      return theme.custom.colors.strength.building;
    }
    case 'developing': {
      return theme.custom.colors.strength.developing;
    }
    case 'strong': {
      return theme.custom.colors.strength.strong;
    }
    case 'automatic': {
      return theme.custom.colors.strength.automatic;
    }
    default: {
      return theme.custom.colors.primary[500];
    }
  }
}

/**
 * Get the emoji associated with a habit's strength level for visual reinforcement
 */
export function getStrengthEmoji(strength: number): string {
  const level = getStrengthLevel(strength);
  switch (level) {
    case 'starting': {
      return '🌱';
    }
    case 'building': {
      return '🌿';
    }
    case 'developing': {
      return '🌳';
    }
    case 'strong': {
      return '💪';
    }
    case 'automatic': {
      return '⚡';
    }
    default: {
      return '🌱';
    }
  }
}

/**
 * Get the background color for the card based on state
 */
export function getBackgroundColor(
  completed: boolean,
  atRisk: boolean,
  theme: AppTheme,
  cardColor?: string,
  isDark?: boolean
): string {
  if (completed) {
    // Slightly stronger tint in dark mode for visibility
    return theme.custom.colors.primary[400] + (isDark ? '28' : '18');
  }
  if (atRisk) {
    return theme.custom.colors.warning[500] + (isDark ? '18' : '0C');
  }
  return cardColor ?? theme.custom.colors.light.card;
}
