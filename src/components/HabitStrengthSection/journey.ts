/**
 * Habit Strength Journey
 *
 * Thin adapter over the app's canonical 5-level strength system
 * (🥉 Starting → 🥈 Building → 🥇 Developing → 🏆 Strong → 💎 Automatic at
 * 0/20/40/60/80). Emojis come from the user's chosen set, so the Strength
 * section, StrengthProgressBar, and HabitCard rank tile all stay in sync.
 */

import type { ProgressEmojiSet } from '@/utils/progressEmojis';

import {
  buildLevels,
  getCurrentLevel,
  getNextLevel,
} from '../StrengthProgressBar/StrengthProgressBar.constants';
import type { LevelConfig } from '../StrengthProgressBar/StrengthProgressBar.types';

export interface StrengthJourney {
  /** All five levels, carrying the user's chosen emoji + per-level color */
  levels: LevelConfig[];
  /** Index of the current level (0-4) */
  index: number;
  current: LevelConfig;
  /** The next level to reach, or null when already at Automatic */
  next: LevelConfig | null;
  /** Whole-number percentage points remaining to reach the next level */
  pctToNext: number;
  /** Progress within the current level band, 0..1 */
  subProgress: number;
}

/** Resolve a 0-100 strength value into its level + progress to the next level. */
export function getStrengthJourney(
  strength: number,
  emojis: ProgressEmojiSet
): StrengthJourney {
  const s = Math.max(0, Math.min(100, Math.round(strength)));
  const levels = buildLevels(emojis);
  const current = getCurrentLevel(s, emojis);
  const next = getNextLevel(s, emojis);
  const index = levels.findIndex((level) => level.threshold === current.threshold);
  const upper = next ? next.threshold : 100;
  const span = upper - current.threshold || 1;

  return {
    current,
    index,
    levels,
    next,
    pctToNext: next ? Math.max(0, next.threshold - s) : 0,
    subProgress: Math.max(0, Math.min(1, (s - current.threshold) / span)),
  };
}
