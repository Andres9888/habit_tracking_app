/**
 * StrengthProgressBar Constants
 */

import { typography } from '@/theme/typography';
import {
  DEFAULT_PROGRESS_EMOJIS,
  type PartialProgressEmojiSet,
} from '@/utils/progressEmojis';
import {
  STRENGTH_LEVEL_THRESHOLDS,
} from '@/utils/strengthThresholds';

import type { LevelConfig, SizeConfig } from './StrengthProgressBar.types';
import { LEVEL_META } from './strengthLevelMeta';

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
      fontSize: typography.caption.fontSize,
      gap: 6,
    },
    default: {
      barHeight: 6,
      emojiContainerSize: 28,
      emojiSize: 20,
      fontSize: typography.caption.fontSize,
      gap: 8,
    },
    large: {
      barHeight: 8,
      emojiContainerSize: 32,
      emojiSize: 24,
      fontSize: typography.bodySmall.fontSize,
      gap: 8,
    },
  };

export const DIVIDER_POSITIONS = STRENGTH_LEVEL_THRESHOLDS.slice(1);

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
