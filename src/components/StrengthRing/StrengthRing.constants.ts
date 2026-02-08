/**
 * StrengthRing Constants - Level configs, colors, and size configurations
 */
import type { LevelInfo, SizeConfig } from './StrengthRing.types';

export const LEVELS: Record<string, LevelInfo> = {
  automatic: {
    color: '#059669', // emerald-600
    colorLight: '#d1fae5', // emerald-100
    emoji: '⚡',
    label: 'Automatic',
  },
  building: {
    color: '#16a34a', // green-600
    colorLight: '#dcfce7', // green-100
    emoji: '🌿',
    label: 'Building',
  },
  developing: {
    color: '#0d9488', // teal-600
    colorLight: '#ccfbf1', // teal-100
    emoji: '🌳',
    label: 'Developing',
  },
  starting: {
    color: '#65a30d', // lime-600
    colorLight: '#ecfccb', // lime-100
    emoji: '🌱',
    label: 'Starting',
  },
  strong: {
    color: '#0891b2', // cyan-600
    colorLight: '#cffafe', // cyan-100
    emoji: '💪',
    label: 'Strong',
  },
};

export const BACKGROUND_COLOR = '#e5e7eb'; // stone-200

export const SIZE_CONFIG: Record<string, SizeConfig> = {
  large: { fontSize: 22, ringSize: 96, strokeWidth: 10 },
  medium: { fontSize: 17, ringSize: 72, strokeWidth: 8 },
  small: { fontSize: 13, ringSize: 48, strokeWidth: 5 },
  tiny: { fontSize: 13, ringSize: 32, strokeWidth: 4 },
};

export const TREND_CONFIG = {
  down: { color: '#ef4444', symbol: '↓' }, // red-500
  stable: { color: '#78716c', symbol: '→' }, // stone-500
  up: { color: '#22c55e', symbol: '↑' }, // green-500
};

/** Get level info based on strength percentage */
export function getLevelInfo(strength: number): LevelInfo {
  if (strength < 20) return LEVELS.starting;
  if (strength < 40) return LEVELS.building;
  if (strength < 60) return LEVELS.developing;
  if (strength < 80) return LEVELS.strong;
  return LEVELS.automatic;
}
