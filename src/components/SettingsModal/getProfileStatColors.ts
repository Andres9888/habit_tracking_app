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

/** Theme-aware colors for the profile stats strip. */
export function getProfileStatColors(
  colors: ThemePalette
): ProfileStatColorSet {
  return {
    activeHabits: colors.status.streak,
    borderTop: colors.border,
    divider: colors.border,
    flawlessDays: colors.status.success,
    label: colors.text.secondary,
    lifetimeCompletions: colors.status.info,
  };
}
