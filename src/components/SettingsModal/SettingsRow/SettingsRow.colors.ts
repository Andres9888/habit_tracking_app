/**
 * Color configurations for SettingsRow component
 */

import { darkColors, lightColors } from '@/theme/darkColors';

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
  isDark: boolean = false
): SettingsRowColors {
  return buildStandardColors(isDark);
}
