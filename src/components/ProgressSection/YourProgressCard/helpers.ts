import type { LevelConfig } from '../types';
import { STRENGTH_LEVELS } from './constants';

export const getStrengthLevel = (strength: number): LevelConfig => {
  if (strength < 20) return STRENGTH_LEVELS.starting;
  if (strength < 40) return STRENGTH_LEVELS.building;
  if (strength < 60) return STRENGTH_LEVELS.developing;
  if (strength < 80) return STRENGTH_LEVELS.strong;
  return STRENGTH_LEVELS.automatic;
};

export const getNextLevel = (strength: number): LevelConfig | null => {
  if (strength >= 80) return null;
  if (strength < 20) return STRENGTH_LEVELS.building;
  if (strength < 40) return STRENGTH_LEVELS.developing;
  if (strength < 60) return STRENGTH_LEVELS.strong;
  return STRENGTH_LEVELS.automatic;
};

export const calculateLevelProgress = (
  clampedStrength: number,
  level: LevelConfig,
  nextLevel: LevelConfig | null
): number => {
  if (!nextLevel) return 100; // At max level
  const levelRange = nextLevel.minThreshold - level.minThreshold;
  const currentProgress = clampedStrength - level.minThreshold;
  return Math.min(100, Math.max(0, (currentProgress / levelRange) * 100));
};
