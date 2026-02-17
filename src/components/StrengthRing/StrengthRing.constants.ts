/**
 * StrengthRing Constants - Level configs, colors, and size configurations
 */
import type { LevelInfo, SizeConfig } from './StrengthRing.types';
import { colors } from '../../theme/colors';

export const LEVELS: Record<string, LevelInfo> = {
  automatic: {
    color: colors.strength.automatic,      // #059669
    colorLight: colors.strength.automaticLight, // #D4F0E2
    emoji: '⚡',
    label: 'Automatic',
  },
  building: {
    color: colors.strength.building,       // #16a34a
    colorLight: colors.strength.buildingLight, // #dcfce7
    emoji: '🌿',
    label: 'Building',
  },
  developing: {
    color: colors.strength.developing,     // #0d9488
    colorLight: colors.strength.developingLight, // #ccfbf1
    emoji: '🌳',
    label: 'Developing',
  },
  starting: {
    color: colors.strength.starting,       // #4D7A0A
    colorLight: colors.strength.startingLight, // #ecfccb
    emoji: '🌱',
    label: 'Starting',
  },
  strong: {
    color: colors.strength.strong,         // #0891b2
    colorLight: colors.strength.strongLight, // #cffafe
    emoji: '💪',
    label: 'Strong',
  },
};

export const BACKGROUND_COLOR = colors.gray[200]; // #DDD8D2 (light border/track)

export const SIZE_CONFIG: Record<string, SizeConfig> = {
  large: { fontSize: 24, ringSize: 96, strokeWidth: 10 },
  medium: { fontSize: 17, ringSize: 72, strokeWidth: 8 },
  small: { fontSize: 13, ringSize: 48, strokeWidth: 5 },
  tiny: { fontSize: 10, ringSize: 32, strokeWidth: 4 },
};

export const TREND_CONFIG = {
  down: { color: colors.error, symbol: '↓' },     // #B53030
  stable: { color: colors.text.secondary, symbol: '→' }, // #6B6560
  up: { color: colors.success, symbol: '↑' },     // #15793C
};

/** Get level info based on strength percentage */
export function getLevelInfo(strength: number): LevelInfo {
  if (strength < 20) return LEVELS.starting;
  if (strength < 40) return LEVELS.building;
  if (strength < 60) return LEVELS.developing;
  if (strength < 80) return LEVELS.strong;
  return LEVELS.automatic;
}
