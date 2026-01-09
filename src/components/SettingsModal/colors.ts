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
  accent: '#1c1917', // stone-800
  background: '#faf9f7',
  card: '#ffffff',
  cardBorder: '#f5f5f4',
  headerText: '#1c1917', // stone-800
  icon: '#1c1917', // stone-800
  mutedText: '#78716c', // stone-500
  versionText: '#78716c', // stone-500
};

export function getSettingsColors(isHighContrast: boolean): SettingsColors {
  return isHighContrast ? HIGH_CONTRAST_COLORS : DEFAULT_COLORS;
}
