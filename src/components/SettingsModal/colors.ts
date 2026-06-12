import { darkColors } from '@/theme/darkColors';
import { colors } from '@/theme/colors';

import type { SettingsColors } from './types';

export const DEFAULT_COLORS: SettingsColors = {
  accent: colors.text.primary,
  background: colors.light.background,
  card: colors.light.card,
  cardBorder: colors.gray[100],
  headerText: colors.text.primary,
  icon: colors.text.primary,
  mutedText: colors.gray[500],
  versionText: colors.gray[500],
};

export const DARK_COLORS: SettingsColors = {
  accent: darkColors.text.primary,
  background: darkColors.background,
  card: darkColors.card,
  cardBorder: darkColors.cardBorder,
  headerText: darkColors.text.primary,
  icon: darkColors.text.primary,
  mutedText: darkColors.text.secondary,
  versionText: darkColors.text.secondary,
};

export function getSettingsColors(isDark: boolean = false): SettingsColors {
  if (isDark) return DARK_COLORS;
  return DEFAULT_COLORS;
}
