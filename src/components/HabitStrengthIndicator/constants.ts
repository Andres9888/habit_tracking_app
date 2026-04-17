/**
 * Strength Level Configuration
 * Colors from theme/colors.ts strength levels
 *
 * Built-in defaults: Starting 🌱 (0-20%), Building 🌿 (20-40%), Developing 🌳 (40-60%),
 *                    Strong 💪 (60-80%), Automatic ⚡ (80-100%)
 *
 * Emojis are user-customizable per habit (or globally) via emojiOverrides.
 */

import {
  DEFAULT_PROGRESS_EMOJIS,
  type PartialProgressEmojiSet,
} from '@/utils/progressEmojis';

import type { StrengthLevel, StrengthLevelConfig } from './types';

type LevelMeta = Omit<StrengthLevelConfig, 'emoji'>;

const LEVEL_META: Record<StrengthLevel, LevelMeta> = {
  automatic: {
    description: 'Fully automatic',
    label: 'Automatic',
    maxThreshold: 100,
    minThreshold: 80,
  },
  building: {
    description: 'Making progress',
    label: 'Building',
    maxThreshold: 40,
    minThreshold: 20,
  },
  developing: {
    description: 'Getting stronger',
    label: 'Developing',
    maxThreshold: 60,
    minThreshold: 40,
  },
  starting: {
    description: 'Just beginning',
    label: 'Starting Out',
    maxThreshold: 20,
    minThreshold: 0,
  },
  strong: {
    description: 'Well-established',
    label: 'Strong',
    maxThreshold: 80,
    minThreshold: 60,
  },
};

export function buildStrengthLevelConfig(
  emojiOverrides?: PartialProgressEmojiSet
): Record<StrengthLevel, StrengthLevelConfig> {
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

export const STRENGTH_LEVEL_CONFIG = buildStrengthLevelConfig();
