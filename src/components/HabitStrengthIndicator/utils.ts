/**
 * HabitStrengthIndicator Utility Functions
 */

import type { StrengthLevel } from './types';
import type { AppTheme } from '../../theme';

/**
 * Get strength level from percentage
 */
export function getStrengthLevel(strength: number): StrengthLevel {
  if (strength < 20) return 'starting';
  if (strength < 40) return 'building';
  if (strength < 60) return 'developing';
  if (strength < 80) return 'strong';
  return 'automatic';
}

/**
 * Get color from theme based on strength level
 */
export function getStrengthColor(
  level: StrengthLevel,
  theme: AppTheme
): string {
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
  }
}
