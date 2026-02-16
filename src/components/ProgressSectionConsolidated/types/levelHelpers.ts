/**
 * Strength Level Helper Functions
 *
 * Utility functions for working with habit strength levels.
 */

import type { LevelThreshold } from './data.types';
import { STRENGTH_LEVELS } from './strengthLevels';

/**
 * Get level info from strength value
 */
export function getLevelFromStrength(strength: number): LevelThreshold {
  const level = STRENGTH_LEVELS.find(
    (l) => strength >= l.min && strength < l.max
  );
  return level || STRENGTH_LEVELS[0];
}

/**
 * Get progress to next level
 */
export function getProgressToNextLevel(strength: number): {
  currentLevel: LevelThreshold;
  nextLevel: LevelThreshold | null;
  progressPercent: number;
  pointsToNext: number;
} {
  const currentLevel = getLevelFromStrength(strength);
  const currentIndex = STRENGTH_LEVELS.indexOf(currentLevel);
  const nextLevel =
    currentIndex < STRENGTH_LEVELS.length - 1
      ? STRENGTH_LEVELS[currentIndex + 1]
      : null;

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
  const progressPercent = rangeSize > 0 ? Math.round((progressInLevel / rangeSize) * 100) : 0;
  const pointsToNext = currentLevel.max - strength;

  return {
    currentLevel,
    nextLevel,
    pointsToNext,
    progressPercent,
  };
}
