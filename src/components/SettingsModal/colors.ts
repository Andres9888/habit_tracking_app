import { colors } from '@/theme/colors';

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

export function getSettingsColors(isHighContrast: boolean): SettingsColors {
  return isHighContrast ? HIGH_CONTRAST_COLORS : DEFAULT_COLORS;
}
