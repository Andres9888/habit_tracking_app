/** Streak Goal Variant B — locked presets from Open Design readability work. */
import type { SemanticColors } from '@/theme/darkColors';

export const STREAK_PRESETS = [
  { days: 0, valueLabel: 'Off', chipLabel: 'NO GOAL', recommended: false },
  { days: 7, valueLabel: '7', chipLabel: 'STARTER', recommended: true },
  { days: 30, valueLabel: '30', chipLabel: 'STEADY', recommended: false },
  { days: 100, valueLabel: '100', chipLabel: 'CHAMP', recommended: false },
] as const;

export const CUSTOM_STREAK_MIN = 2;
export const CUSTOM_STREAK_MAX = 999;
export const CUSTOM_STREAK_DEFAULT = 45;

export function isPresetStreak(days: number): boolean {
  return STREAK_PRESETS.some((p) => p.days === days);
}

export function clampStreakDays(n: number): number {
  return Math.min(CUSTOM_STREAK_MAX, Math.max(CUSTOM_STREAK_MIN, n));
}

export function streakChipPalette(
  colors: SemanticColors,
  accent: 'streak' | 'emerald'
) {
  if (accent === 'emerald') {
    return {
      bg: colors.primary[100],
      border: colors.primary[500],
      bottom: colors.primary[700],
      fg: colors.primary[700],
    };
  }
  return {
    bg: colors.status.streakLight,
    border: colors.status.streak,
    bottom: colors.status.streakText,
    fg: colors.status.streakText,
  };
}
