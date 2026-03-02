import { darkColors } from '@/theme/darkColors';
import { colors } from '@/theme/colors';

import type { SettingsColors } from './types';

const highContrastAccent = colors.warning;

export const HIGH_CONTRAST_COLORS: SettingsColors = {
  accent: highContrastAccent,
  background: darkColors.background,
  card: darkColors.card,
  cardBorder: darkColors.border,
  headerText: darkColors.text.primary,
  icon: highContrastAccent,
  mutedText: highContrastAccent,
  versionText: highContrastAccent,
};

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

export function getSettingsColors(
  isHighContrast: boolean,
  isDark: boolean = false
): SettingsColors {
  if (isHighContrast) return HIGH_CONTRAST_COLORS;
  if (isDark) return DARK_COLORS;
  return DEFAULT_COLORS;
}
