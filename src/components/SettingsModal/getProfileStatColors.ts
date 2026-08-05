import type { SemanticColors } from '@/theme/darkColors';

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
  colors: SemanticColors
): ProfileStatColorSet {
  // One neutral numeral voice — no rainbow competing with the gold streak hero.
  return {
    activeHabits: colors.text.primary,
    borderTop: colors.border,
    divider: colors.border,
    flawlessDays: colors.text.primary,
    label: colors.text.secondary,
    lifetimeCompletions: colors.text.primary,
  };
}
