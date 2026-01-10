/**
 * Color configurations for SettingsRow component
 */

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
  background: '#ffffff',
  border: '#f5f5f4',
  chevron: '#78716c', // stone-500
  label: '#1c1917', // stone-800
  switchThumb: '#ffffff',
  switchTrackFalse: '#d1d5db',
  switchTrackTrue: '#1c1917', // stone-800
  value: '#78716c', // stone-500
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
