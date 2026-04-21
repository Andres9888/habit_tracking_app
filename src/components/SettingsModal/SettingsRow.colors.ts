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
  pulseBg: string;
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
  pulseBg: 'rgba(252,211,77,0.15)',
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
    // Faint emerald wash used by the toggle pulse animation (animates opacity 0→1→0 on top of card bg)
    pulseBg: isDark ? 'rgba(52,211,153,0.08)' : 'rgba(5,150,105,0.06)',
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
