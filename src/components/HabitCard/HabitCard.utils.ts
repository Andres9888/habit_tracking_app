/**
 * HabitCard Utility Functions
 *
 * Pure helper functions for deriving visual properties from habit state.
 * All functions are side-effect-free and safe to call from any context.
 */

import type { AppTheme } from '../../theme';
import { getStrengthLevel } from '../HabitStrengthIndicator';

/**
 * Maps a numeric strength (0–100) to the corresponding theme color.
 *
 * Strength levels: starting → building → developing → strong → automatic
 *
 * @param strength - Habit strength percentage (0–100)
 * @param theme - Current app theme (provides color tokens)
 * @returns Hex color string from `theme.custom.colors.strength.*`
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
 * Maps a numeric strength (0–100) to an emoji for visual reinforcement.
 *
 * 🌱 starting → 🌿 building → 🌳 developing → 💪 strong → ⚡ automatic
 *
 * @param strength - Habit strength percentage (0–100)
 * @returns Emoji string representing the growth stage
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
 * Determines the card background color based on completion and risk state.
 *
 * Priority: completed (muted green 20%) > atRisk (warning 10%) > default card color.
 *
 * @param completed - Whether the habit is completed today
 * @param atRisk - Whether the habit is flagged at-risk (prediction < 40%)
 * @param theme - Current app theme
 * @param cardColor - Optional override from theme context (e.g. dark mode)
 * @returns Hex color string (may include alpha suffix)
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
