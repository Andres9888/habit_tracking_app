import { colors } from '@/theme/colors';
import { lightColors, darkColors } from '@/theme/darkColors';

import type { SettingsColors } from './types';

/** High contrast theme with yellow accent */
export const HIGH_CONTRAST_COLORS: SettingsColors = {
  accent: '#facc15',
  background: '#000000',
  card: '#111111',
  cardBorder: '#2f2f2f',
  headerText: '#ffffff',
  icon: '#facc15',
  mutedText: '#facc15',
  versionText: '#facc15',
};

/** Default light mode colors using semantic tokens */
export const DEFAULT_COLORS: SettingsColors = {
  accent: colors.text.primary,
  background: lightColors.gray[50],
  card: lightColors.card,
  cardBorder: lightColors.cardBorder,
  headerText: colors.text.primary,
  icon: colors.text.primary,
  mutedText: lightColors.text.secondary,
  versionText: lightColors.text.secondary,
};

/** Dark mode colors using semantic tokens */
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
  isDark: boolean = false,
): SettingsColors {
  if (isHighContrast) return HIGH_CONTRAST_COLORS;
  if (isDark) return DARK_COLORS;
  return DEFAULT_COLORS;
}
