import { colors } from '@/theme/colors';
import { darkColors } from '@/theme/darkColors';

import type { SettingsColors } from './types';

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

export const DEFAULT_COLORS: SettingsColors = {
  accent: colors.text.primary,
  background: colors.gray[50],
  card: colors.light.card,
  cardBorder: colors.gray[100],
  headerText: colors.text.primary,
  icon: colors.text.primary,
  mutedText: colors.gray[500],
  versionText: colors.gray[500],
};

export const DARK_COLORS: SettingsColors = {
  accent: darkColors.text.primary,        // #F9FAFB
  background: darkColors.background,      // #111827
  card: darkColors.card,                  // #1F2937
  cardBorder: darkColors.border,          // #374151
  headerText: darkColors.text.primary,    // #F9FAFB
  icon: darkColors.text.primary,          // #F9FAFB
  mutedText: darkColors.text.secondary,   // #9CA3AF
  versionText: darkColors.text.secondary, // #9CA3AF
};

export function getSettingsColors(
  isHighContrast: boolean,
  isDark: boolean = false
): SettingsColors {
  if (isHighContrast) return HIGH_CONTRAST_COLORS;
  if (isDark) return DARK_COLORS;
  return DEFAULT_COLORS;
}
