/**
 * StrengthProgressBar Constants
 */

import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

import type { LevelConfig, SizeConfig } from './StrengthProgressBar.types';
import { t } from '../../i18n';

/**
 * Build LEVELS with i18n labels. Called as a getter so translations
 * resolve at render time (after locale is set).
 */
export function getLevels(): LevelConfig[] {
  return [
    {
      color: colors.strength.starting,
      colorBg: colors.strength.startingLight,
      emoji: '🌱',
      label: t('strength.starting'),
      threshold: 0,
    },
    {
      color: colors.strength.building,
      colorBg: colors.strength.buildingLight,
      emoji: '🌿',
      label: t('strength.building'),
      threshold: 20,
    },
    {
      color: colors.strength.developing,
      colorBg: colors.strength.developingLight,
      emoji: '🌳',
      label: t('strength.developing'),
      threshold: 40,
    },
    {
      color: colors.strength.strong,
      colorBg: colors.strength.strongLight,
      emoji: '💪',
      label: t('strength.strong'),
      threshold: 60,
    },
    {
      color: colors.strength.automatic,
      colorBg: colors.strength.automaticLight,
      emoji: '⚡',
      label: t('strength.automatic'),
      threshold: 80,
    },
  ];
}

/** @deprecated Use getLevels() for i18n support. Kept for backward compat. */
export const LEVELS: LevelConfig[] = getLevels();

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
  const levels = getLevels();
  for (let i = levels.length - 1; i >= 0; i--) {
    if (strength >= levels[i].threshold) {
      return levels[i];
    }
  }
  return levels[0];
}

export function getNextLevel(strength: number): LevelConfig | null {
  const levels = getLevels();
  for (const level of levels) {
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
