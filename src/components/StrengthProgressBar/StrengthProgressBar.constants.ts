/**
 * StrengthProgressBar Constants
 */

import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import {
  DEFAULT_PROGRESS_EMOJIS,
  type PartialProgressEmojiSet,
  type StrengthLevelKey,
} from '@/utils/progressEmojis';

import type { LevelConfig, SizeConfig } from './StrengthProgressBar.types';

type LevelMeta = Omit<LevelConfig, 'emoji'> & { key: StrengthLevelKey };

const LEVEL_META: LevelMeta[] = [
  {
    color: colors.strength.starting,
    colorBg: colors.strength.startingLight,
    key: 'starting',
    label: 'Starting',
    threshold: 0,
  },
  {
    color: colors.strength.building,
    colorBg: colors.strength.buildingLight,
    key: 'building',
    label: 'Building',
    threshold: 20,
  },
  {
    color: colors.strength.developing,
    colorBg: colors.strength.developingLight,
    key: 'developing',
    label: 'Developing',
    threshold: 40,
  },
  {
    color: colors.strength.strong,
    colorBg: colors.strength.strongLight,
    key: 'strong',
    label: 'Strong',
    threshold: 60,
  },
  {
    color: colors.strength.automatic,
    colorBg: colors.strength.automaticLight,
    key: 'automatic',
    label: 'Automatic',
    threshold: 80,
  },
];

export function buildLevels(
  emojiOverrides?: PartialProgressEmojiSet
): LevelConfig[] {
  return LEVEL_META.map(({ key, ...rest }) => ({
    ...rest,
    emoji: emojiOverrides?.[key] ?? DEFAULT_PROGRESS_EMOJIS[key],
  }));
}

export const LEVELS: LevelConfig[] = buildLevels();

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

export function getCurrentLevel(
  strength: number,
  emojiOverrides?: PartialProgressEmojiSet
): LevelConfig {
  const levels = emojiOverrides ? buildLevels(emojiOverrides) : LEVELS;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (strength >= levels[i].threshold) return levels[i];
  }
  return levels[0];
}

export function getNextLevel(
  strength: number,
  emojiOverrides?: PartialProgressEmojiSet
): LevelConfig | null {
  const levels = emojiOverrides ? buildLevels(emojiOverrides) : LEVELS;
  for (const level of levels) {
    if (strength < level.threshold) return level;
  }
  return null;
}

export function formatStrengthPercentage(strength: number): string {
  return `${Math.round(strength)}%`;
}

export { type SizeConfig } from './StrengthProgressBar.types';
