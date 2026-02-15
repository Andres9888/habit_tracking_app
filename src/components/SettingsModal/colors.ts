
import type { SettingsColors } from './types';
import { colors } from '@/theme/colors';

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
  accent: '#F9FAFB',
  background: '#111827',
  card: '#1F2937',
  cardBorder: '#374151',
  headerText: '#F9FAFB',
  icon: '#F9FAFB',
  mutedText: '#9CA3AF',
  versionText: '#9CA3AF',
};

export function getSettingsColors(
  isHighContrast: boolean,
  isDark: boolean = false
): SettingsColors {
  if (isHighContrast) return HIGH_CONTRAST_COLORS;
  if (isDark) return DARK_COLORS;
  return DEFAULT_COLORS;
}
