/**
 * Color configurations for SettingsRow component
 */

import { darkColors, lightColors } from '@/theme/darkColors';
import { highContrastColors } from '@/theme/highContrastColors';

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

export const HIGH_CONTRAST_COLORS: SettingsRowColors = {
  background: highContrastColors.background,
  border: highContrastColors.border,
  chevron: highContrastColors.accent,
  label: '#ffffff',
  switchThumb: '#000000',
  switchTrackFalse: '#525252',
  switchTrackTrue: highContrastColors.accent,
  value: highContrastColors.accent,
};

const buildStandardColors = (isDark: boolean): SettingsRowColors => {
  const semantic = isDark ? darkColors : lightColors;

  return {
    background: semantic.card,
    border: semantic.border,
    chevron: semantic.text.secondary,
    label: semantic.text.primary,
    switchThumb: semantic.text.inverse,
    switchTrackFalse: semantic.gray[300],
    switchTrackTrue: semantic.primary[500],
    value: semantic.text.secondary,
  };
};

export function getSettingsRowColors(
  highContrastMode: boolean,
  isDark: boolean = false
): SettingsRowColors {
  if (highContrastMode) return HIGH_CONTRAST_COLORS;
  return buildStandardColors(isDark);
}
