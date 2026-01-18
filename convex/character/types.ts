/**
 * Type definitions for character stats
 */

import { v } from 'convex/values';

export const characterStatsValidator = v.object({
  attributes: v.object({
    energy: v.number(),
    strength: v.number(),
    vitality: v.number(),
    wisdom: v.number(),
  }),
  level: v.number(),
  stats: v.object({
    activeHabits: v.number(),
    dayStreak: v.number(),
    totalPower: v.number(),
  }),
  title: v.string(),
  totalXP: v.number(),
  xp: v.number(),
  xpToNextLevel: v.number(),
});

export interface CharacterStats {
  attributes: {
    energy: number;
    strength: number;
    vitality: number;
    wisdom: number;
  };
  level: number;
  stats: {
    activeHabits: number;
    dayStreak: number;
    totalPower: number;
  };
  title: string;
  totalXP: number;
  xp: number;
  xpToNextLevel: number;
}

export const DEFAULT_CHARACTER_STATS: CharacterStats = {
  attributes: {
    energy: 0,
    strength: 0,
    vitality: 0,
    wisdom: 0,
  },
  level: 1,
  stats: {
    activeHabits: 0,
    dayStreak: 0,
    totalPower: 0,
  },
  title: 'Novice',
  totalXP: 0,
  xp: 0,
  xpToNextLevel: 50,
};
