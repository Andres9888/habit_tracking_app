/**
 * StrengthProgressBar Constants
 */

import type { LevelConfig, SizeConfig } from './StrengthProgressBar.types';

export const LEVELS: LevelConfig[] = [
  {
    color: '#65a30d',
    colorBg: '#ecfccb',
    emoji: '🌱',
    label: 'Starting',
    threshold: 0,
  },
  {
    color: '#16a34a',
    colorBg: '#dcfce7',
    emoji: '🌿',
    label: 'Building',
    threshold: 20,
  },
  {
    color: '#0d9488',
    colorBg: '#ccfbf1',
    emoji: '🌳',
    label: 'Developing',
    threshold: 40,
  },
  {
    color: '#0891b2',
    colorBg: '#cffafe',
    emoji: '💪',
    label: 'Strong',
    threshold: 60,
  },
  {
    color: '#059669',
    colorBg: '#d1fae5',
    emoji: '⚡',
    label: 'Automatic',
    threshold: 80,
  },
];

export const SIZE_CONFIG: Record<'compact' | 'default' | 'large', SizeConfig> =
  {
    compact: {
      barHeight: 4,
      emojiContainerSize: 24,
      emojiSize: 18,
      fontSize: 11,
      gap: 6,
    },
    default: {
      barHeight: 6,
      emojiContainerSize: 28,
      emojiSize: 20,
      fontSize: 12,
      gap: 8,
    },
    large: {
      barHeight: 8,
      emojiContainerSize: 32,
      emojiSize: 24,
      fontSize: 14,
      gap: 8,
    },
  };

export const DIVIDER_POSITIONS = [20, 40, 60, 80];

export function getCurrentLevel(strength: number): LevelConfig {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (strength >= LEVELS[i].threshold) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getNextLevel(strength: number): LevelConfig | null {
  for (const level of LEVELS) {
    if (strength < level.threshold) {
      return level;
    }
  }
  return null;
}

export function formatStrengthPercentage(strength: number): string {
  return `${Math.round(strength)}%`;
}

export { type SizeConfig } from './StrengthProgressBar.types';
