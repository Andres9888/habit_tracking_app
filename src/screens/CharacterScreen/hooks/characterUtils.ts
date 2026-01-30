/**
 * Character Data Utility Functions
 *
 * Helper functions for calculating character attributes and achievements.
 */

import { differenceInDays, subDays, format } from 'date-fns';
import type { CharacterData, Achievement } from '../types';

const XP_PER_LEVEL = 100;

interface HabitLike {
  currentStreak?: number;
  createdAt: number;
  accessibility?: number;
}

interface TrackingLike {
  date: string;
}

export function getEmptyCharacterData(): CharacterData {
  return {
    attributes: { energy: 0, strength: 0, vitality: 0, wisdom: 0 },
    level: 1,
    recentAchievements: [],
    stats: { activeHabits: 0, dayStreak: 0, totalPower: 0 },
    title: 'Newcomer',
    xp: 0,
    xpToNextLevel: XP_PER_LEVEL,
  };
}

export function calculateAttributes(
  habits: HabitLike[],
  trackingData: TrackingLike[]
) {
  const now = new Date();
  const last7Days = new Set(
    Array.from({ length: 7 }, (_, i) => format(subDays(now, i), 'yyyy-MM-dd'))
  );

  const recentCompletions = trackingData.filter((t) =>
    last7Days.has(t.date)
  ).length;
  const maxPossible = habits.length * 7;
  const energy =
    maxPossible > 0 ? Math.round((recentCompletions / maxPossible) * 100) : 0;

  const avgStreak =
    habits.reduce((sum, h) => sum + (h.currentStreak ?? 0), 0) / habits.length;
  const strength = Math.min(100, Math.round(avgStreak * 5));

  const avgAccessibility =
    habits.reduce((sum, h) => sum + (h.accessibility ?? 0.5), 0) /
    habits.length;
  const vitality = Math.round(avgAccessibility * 100);

  const avgAge =
    habits.reduce(
      (sum, h) => sum + differenceInDays(now, new Date(h.createdAt)),
      0
    ) / habits.length;
  const wisdom = Math.min(100, Math.round(avgAge / 3));

  return { energy, strength, vitality, wisdom };
}

export function generateAchievements(
  streak: number,
  completions: number,
  level: number
): Achievement[] {
  const achievements: Achievement[] = [];

  if (streak >= 7) {
    achievements.push({
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      id: 'week-warrior',
      title: 'Week Warrior',
    });
  }

  if (streak >= 30) {
    achievements.push({
      description: 'Maintain a 30-day streak',
      icon: '💪',
      id: 'month-master',
      title: 'Month Master',
    });
  }

  if (completions >= 100) {
    achievements.push({
      description: 'Complete 100 habits',
      icon: '💯',
      id: 'century',
      title: 'Century Club',
    });
  }

  if (level >= 5) {
    achievements.push({
      description: 'Reach level 5',
      icon: '⭐',
      id: 'rising-star',
      title: 'Rising Star',
    });
  }

  return achievements;
}

export function getTitle(level: number): string {
  if (level >= 20) return 'Habit Legend';
  if (level >= 15) return 'Habit Master';
  if (level >= 10) return 'Habit Champion';
  if (level >= 5) return 'Habit Hero';
  if (level >= 3) return 'Habit Apprentice';
  return 'Habit Beginner';
}
