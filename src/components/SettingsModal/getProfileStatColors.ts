import { highContrastColors } from '@/theme/highContrastColors';
import type { lightColors } from '@/theme/darkColors';

type ThemePalette = typeof lightColors;

export interface ProfileStatColorSet {
  activeHabits: string;
  borderTop: string;
  divider: string;
  flawlessDays: string;
  label: string;
  lifetimeCompletions: string;
}

/** Theme-aware colors for the profile stats strip (light, dark, high contrast). */
export function getProfileStatColors(
  colors: ThemePalette,
  highContrastMode: boolean
): ProfileStatColorSet {
  if (highContrastMode) {
    return {
      activeHabits: colors.status.streakText,
      borderTop: highContrastColors.border,
      divider: highContrastColors.border,
      flawlessDays: colors.status.successText,
      label: colors.text.secondary,
      lifetimeCompletions: colors.status.infoText,
    };
  }

  return {
    activeHabits: colors.status.streak,
    borderTop: colors.border,
    divider: colors.border,
    flawlessDays: colors.status.success,
    label: colors.text.secondary,
    lifetimeCompletions: colors.status.info,
  };
}
