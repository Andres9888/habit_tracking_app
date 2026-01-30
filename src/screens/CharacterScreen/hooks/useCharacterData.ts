/**
 * useCharacterData Hook
 *
 * Computes character stats and attributes from actual habit data.
 * Replaces the mock data with real calculations.
 */

import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { subDays, format } from 'date-fns';

import { api } from '../../../../convex/_generated/api';
import type { CharacterData } from '../types';
import {
  calculateAttributes,
  generateAchievements,
  getEmptyCharacterData,
  getTitle,
} from './characterUtils';

const XP_PER_COMPLETION = 10;
const XP_PER_LEVEL = 100;

function getLast30Days(): string[] {
  const now = new Date();
  return Array.from({ length: 30 }, (_, i) =>
    format(subDays(now, i), 'yyyy-MM-dd')
  );
}

export function useCharacterData(): CharacterData | null {
  const habits = useQuery(api.habits.list);
  const dates = useMemo(() => getLast30Days(), []);
  const trackingData = useQuery(api.habits.getTracking, { dates });

  return useMemo(() => {
    if (!habits || !trackingData) return null;

    const activeHabits = habits.filter((h) => !h.archived && !h.paused);
    if (activeHabits.length === 0) return getEmptyCharacterData();

    const totalCompletions = trackingData.length;
    const xp = totalCompletions * XP_PER_COMPLETION;
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const xpInCurrentLevel = xp % XP_PER_LEVEL;
    const maxStreak = Math.max(
      ...activeHabits.map((h) => h.currentStreak ?? 0),
      0
    );
    const attributes = calculateAttributes(activeHabits, trackingData);
    const achievements = generateAchievements(
      maxStreak,
      totalCompletions,
      level
    );
    const totalPower =
      attributes.energy +
      attributes.strength +
      attributes.vitality +
      attributes.wisdom;

    return {
      attributes,
      level,
      recentAchievements: achievements.slice(0, 3),
      stats: {
        activeHabits: activeHabits.length,
        dayStreak: maxStreak,
        totalPower: Math.round(totalPower),
      },
      title: getTitle(level),
      xp: xpInCurrentLevel,
      xpToNextLevel: XP_PER_LEVEL,
    };
  }, [habits, trackingData]);
}

export default useCharacterData;
