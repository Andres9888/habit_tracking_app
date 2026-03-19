/**
 * StrengthRing Constants - Level configs, colors, and size configurations
 */
import type { LevelInfo, SizeConfig } from './StrengthRing.types';
import { colors } from '@/theme/colors';

export const LEVELS: Record<string, LevelInfo> = {
  automatic: {
    color: colors.strength.automatic,
    colorLight: colors.strength.automaticLight,
    emoji: '⚡',
    label: 'Automatic',
  },
  building: {
    color: colors.strength.building,
    colorLight: colors.strength.buildingLight,
    emoji: '🌿',
    label: 'Building',
  },
  developing: {
    color: colors.strength.developing,
    colorLight: colors.strength.developingLight,
    emoji: '🌳',
    label: 'Developing',
  },
  starting: {
    color: colors.strength.starting,
    colorLight: colors.strength.startingLight,
    emoji: '🌱',
    label: 'Starting',
  },
  strong: {
    color: colors.strength.strong,
    colorLight: colors.strength.strongLight,
    emoji: '💪',
    label: 'Strong',
  },
};

export const BACKGROUND_COLOR = colors.gray[200];

export const SIZE_CONFIG: Record<string, SizeConfig> = {
  large: { fontSize: 22, ringSize: 96, strokeWidth: 10 },
  medium: { fontSize: 17, ringSize: 72, strokeWidth: 8 },
  small: { fontSize: 13, ringSize: 48, strokeWidth: 5 },
  tiny: { fontSize: 10, ringSize: 32, strokeWidth: 4 },
};

export const TREND_CONFIG = {
  down: { color: colors.error, symbol: '↓' },
  stable: { color: colors.gray[400], symbol: '→' },
  up: { color: colors.success, symbol: '↑' },
};

/** Get level info based on strength percentage */
export function getLevelInfo(strength: number): LevelInfo {
  if (strength < 20) return LEVELS.starting;
  if (strength < 40) return LEVELS.building;
  if (strength < 60) return LEVELS.developing;
  if (strength < 80) return LEVELS.strong;
  return LEVELS.automatic;
}
