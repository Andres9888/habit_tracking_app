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
  /** Text tint for a row's current value. Named `valueText`, not `value` —
   *  Reanimated's dev guard warns on any `.value` read during render. */
  valueText: string;
  /** Recessed fill behind a row's value ("Classic", "Chime") — Habit Browser meta-pill. */
  valuePillBg: string;
}

const buildStandardColors = (isDark: boolean): SettingsRowColors => {
  const semantic = isDark ? darkColors : lightColors;

  return {
    // Transparent so the card's paper surface reads through; rows are always
    // rendered inside a SettingsSection / AccountGroupCard shell.
    background: 'transparent',
    border: semantic.cardDivider,
    chevron: semantic.text.secondary,
    label: semantic.text.primary,
    switchThumb: semantic.text.inverse,
    switchTrackFalse: semantic.gray[300],
    switchTrackTrue: semantic.primary[500],
    valueText: semantic.text.secondary,
    valuePillBg: semantic.background,
  };
};

export function getSettingsRowColors(
  isDark: boolean = false
): SettingsRowColors {
  return buildStandardColors(isDark);
}
