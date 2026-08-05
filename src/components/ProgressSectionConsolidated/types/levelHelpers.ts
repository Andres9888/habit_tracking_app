/**
 * Strength Level Helper Functions
 *
 * Utility functions for working with habit strength levels.
 */

import type { LevelThreshold } from './data.types';
import { STRENGTH_LEVELS } from './strengthLevels';
import {
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiSet,
} from '../../../utils/progressEmojis';

function applyEmojiOverride(
  level: LevelThreshold,
  emojis?: ProgressEmojiSet
): LevelThreshold {
  if (!emojis) return level;
  const index = STRENGTH_LEVELS.indexOf(level);
  const key = STRENGTH_LEVEL_KEYS[index] ?? STRENGTH_LEVEL_KEYS[0];
  return { ...level, emoji: emojis[key] };
}

/**
 * Get level info from strength value
 */
export function getLevelFromStrength(
  strength: number,
  emojis?: ProgressEmojiSet
): LevelThreshold {
  const level = STRENGTH_LEVELS.find(
    (l) => strength >= l.min && strength < l.max
  );
  return applyEmojiOverride(level || STRENGTH_LEVELS[0], emojis);
}

/**
 * Get progress to next level
 */
export function getProgressToNextLevel(
  strength: number,
  emojis?: ProgressEmojiSet
): {
  currentLevel: LevelThreshold;
  nextLevel: LevelThreshold | null;
  progressPercent: number;
  pointsToNext: number;
} {
  const baseCurrent =
    STRENGTH_LEVELS.find((l) => strength >= l.min && strength < l.max) ||
    STRENGTH_LEVELS[0];
  const currentIndex = STRENGTH_LEVELS.indexOf(baseCurrent);
  const currentLevel = applyEmojiOverride(baseCurrent, emojis);
  const rawNext =
    currentIndex < STRENGTH_LEVELS.length - 1
      ? STRENGTH_LEVELS[currentIndex + 1]
      : null;
  const nextLevel = rawNext ? applyEmojiOverride(rawNext, emojis) : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      pointsToNext: 0,
      progressPercent: 100,
    };
  }

  const rangeSize = currentLevel.max - currentLevel.min;
  const progressInLevel = strength - currentLevel.min;
  const progressPercent =
    rangeSize > 0 ? Math.round((progressInLevel / rangeSize) * 100) : 0;
  const pointsToNext = currentLevel.max - strength;

  return {
    currentLevel,
    nextLevel,
    pointsToNext,
    progressPercent,
  };
}
