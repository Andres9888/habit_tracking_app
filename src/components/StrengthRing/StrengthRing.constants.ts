/**
 * StrengthRing Constants - Level configs, colors, and size configurations
 */
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import {
  DEFAULT_PROGRESS_EMOJIS,
  type PartialProgressEmojiSet,
  type StrengthLevelKey,
} from '@/utils/progressEmojis';

import type { LevelInfo, SizeConfig } from './StrengthRing.types';

type LevelMeta = Omit<LevelInfo, 'emoji'>;

const LEVEL_META: Record<StrengthLevelKey, LevelMeta> = {
  automatic: {
    color: colors.strength.automatic,
    colorLight: colors.strength.automaticLight,
    label: 'Automatic',
  },
  building: {
    color: colors.strength.building,
    colorLight: colors.strength.buildingLight,
    label: 'Building',
  },
  developing: {
    color: colors.strength.developing,
    colorLight: colors.strength.developingLight,
    label: 'Developing',
  },
  starting: {
    color: colors.strength.starting,
    colorLight: colors.strength.startingLight,
    label: 'Starting',
  },
  strong: {
    color: colors.strength.strong,
    colorLight: colors.strength.strongLight,
    label: 'Strong',
  },
};

export function buildLevels(
  emojiOverrides?: PartialProgressEmojiSet
): Record<StrengthLevelKey, LevelInfo> {
  return {
    automatic: {
      ...LEVEL_META.automatic,
      emoji: emojiOverrides?.automatic ?? DEFAULT_PROGRESS_EMOJIS.automatic,
    },
    building: {
      ...LEVEL_META.building,
      emoji: emojiOverrides?.building ?? DEFAULT_PROGRESS_EMOJIS.building,
    },
    developing: {
      ...LEVEL_META.developing,
      emoji: emojiOverrides?.developing ?? DEFAULT_PROGRESS_EMOJIS.developing,
    },
    starting: {
      ...LEVEL_META.starting,
      emoji: emojiOverrides?.starting ?? DEFAULT_PROGRESS_EMOJIS.starting,
    },
    strong: {
      ...LEVEL_META.strong,
      emoji: emojiOverrides?.strong ?? DEFAULT_PROGRESS_EMOJIS.strong,
    },
  };
}

export const LEVELS: Record<StrengthLevelKey, LevelInfo> = buildLevels();

export const BACKGROUND_COLOR = colors.gray[200];

export const SIZE_CONFIG: Record<string, SizeConfig> = {
  large: { fontSize: typography.heading1.fontSize, ringSize: 96, strokeWidth: 10 },
  medium: { fontSize: typography.body.fontSize, ringSize: 72, strokeWidth: 8 },
  small: { fontSize: typography.caption.fontSize, ringSize: 48, strokeWidth: 5 },
  tiny: { fontSize: typography.tabBar.fontSize, ringSize: 32, strokeWidth: 4 },
};

export const TREND_CONFIG = {
  down: { color: colors.error, symbol: '↓' },
  stable: { color: colors.gray[400], symbol: '→' },
  up: { color: colors.success, symbol: '↑' },
};

/** Get level info based on strength percentage */
export function getLevelInfo(
  strength: number,
  emojiOverrides?: PartialProgressEmojiSet
): LevelInfo {
  const levels = emojiOverrides ? buildLevels(emojiOverrides) : LEVELS;
  if (strength < 20) return levels.starting;
  if (strength < 40) return levels.building;
  if (strength < 60) return levels.developing;
  if (strength < 80) return levels.strong;
  return levels.automatic;
}
