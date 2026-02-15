/**
 * StrengthProgressBar Constants
 */

import type { LevelConfig, SizeConfig } from './StrengthProgressBar.types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export const LEVELS: LevelConfig[] = [
  {
    color: colors.strength.starting,
    colorBg: colors.strength.startingLight,
    emoji: '🌱',
    label: 'Starting',
    threshold: 0,
  },
  {
    color: colors.strength.building,
    colorBg: colors.strength.buildingLight,
    emoji: '🌿',
    label: 'Building',
    threshold: 20,
  },
  {
    color: colors.strength.developing,
    colorBg: colors.strength.developingLight,
    emoji: '🌳',
    label: 'Developing',
    threshold: 40,
  },
  {
    color: colors.strength.strong,
    colorBg: colors.strength.strongLight,
    emoji: '💪',
    label: 'Strong',
    threshold: 60,
  },
  {
    color: colors.strength.automatic,
    colorBg: colors.strength.automaticLight,
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
      fontSize: typography.caption.fontSize ?? 13,
      gap: 6,
    },
    default: {
      barHeight: 6,
      emojiContainerSize: 28,
      emojiSize: 20,
      fontSize: typography.caption.fontSize ?? 13,
      gap: 8,
    },
    large: {
      barHeight: 8,
      emojiContainerSize: 32,
      emojiSize: 24,
      fontSize: typography.bodySmall.fontSize ?? 15,
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
