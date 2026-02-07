/**
 * Color configurations for SettingsRow component
 */

import { colors } from '@/theme/colors';

export interface SettingsRowColors {
  background: string;
  border: string;
  chevron: string;
  label: string;
  switchThumb: string;
  switchTrackFalse: string;
  switchTrackTrue: string;
  value: string;
}

export const STANDARD_COLORS: SettingsRowColors = {
  background: colors.light.card,
  border: colors.gray[100],
  chevron: colors.gray[500],
  label: colors.text.primary,
  switchThumb: colors.text.inverse,
  switchTrackFalse: colors.gray[300],
  switchTrackTrue: colors.text.primary,
  value: colors.gray[500],
};

export const HIGH_CONTRAST_COLORS: SettingsRowColors = {
  background: '#111111',
  border: '#2f2f2f',
  chevron: '#facc15',
  label: '#ffffff',
  switchThumb: '#000000',
  switchTrackFalse: '#525252',
  switchTrackTrue: '#facc15',
  value: '#facc15',
};

export function getSettingsRowColors(
  highContrastMode: boolean
): SettingsRowColors {
  return highContrastMode ? HIGH_CONTRAST_COLORS : STANDARD_COLORS;
}
