/**
 * HabitCard Utility Functions
 * Helper functions for strength-related calculations
 */

import type { AppTheme } from '../../theme';
import { getStrengthLevel } from '../HabitStrengthIndicator';
import {
  DEFAULT_PROGRESS_EMOJIS,
  type ProgressEmojiSet,
} from '../../utils/progressEmojis';

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
export function getStrengthEmoji(
  strength: number,
  emojis: ProgressEmojiSet = DEFAULT_PROGRESS_EMOJIS
): string {
  const level = getStrengthLevel(strength);
  return emojis[level] ?? emojis.starting;
}

/**
 * Get the background color for the card based on state
 */
export function getBackgroundColor(
  completed: boolean,
  atRisk: boolean,
  theme: AppTheme,
  cardColor?: string
): string {
  if (completed) {
    return theme.custom.colors.primary[400] + '20'; // 20% opacity muted green
  }
  if (atRisk) {
    return theme.custom.colors.warning[500] + '10'; // 10% opacity warning
  }
  return cardColor ?? theme.custom.colors.light.card;
}
