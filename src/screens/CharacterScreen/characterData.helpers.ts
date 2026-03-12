import { format, startOfDay, subDays } from 'date-fns';
import type { Achievement, CharacterData } from './types';

const STREAK_LOOKBACK_DAYS = 30;
const STARTER_ACHIEVEMENT: Achievement = {
  description: 'Add your first habit to unlock progress tracking',
  icon: '🌱',
  id: 'starter',
  title: 'Getting Started',
};

export interface HabitLike {
  _id: string | number;
}

export interface TrackingLike {
  completed?: boolean;
  date: string;
  habitId: string | number;
}

export function buildDateRange(): string[] {
  const today = startOfDay(new Date());
  return Array.from({ length: STREAK_LOOKBACK_DAYS }, (_, index) => format(subDays(today, index), 'yyyy-MM-dd'));
}

function buildAttributes(activeHabits: number, dayStreak: number, totalCompletions: number) {
  return {
    energy: Math.min(100, 20 + dayStreak * 4),
    strength: Math.min(100, 30 + activeHabits * 6),
    vitality: Math.min(100, 18 + totalCompletions * 2),
    wisdom: Math.min(100, 20 + dayStreak * 3 + Math.floor(totalCompletions / 2)),
  };
}

function buildAchievements(activeHabits: number, dayStreak: number, totalCompletions: number): Achievement[] {
  if (activeHabits === 0) return [STARTER_ACHIEVEMENT];
  const achievements: Achievement[] = [{ description: 'You have an active habit set', icon: '🎯', id: 'active-habits', title: 'Habit Builder' }];
  if (dayStreak >= 3) achievements.push({ description: 'Keep the streak going', icon: '🔥', id: 'streak', title: 'Consistent' });
  if (totalCompletions >= 10) achievements.push({ description: 'Completed 10 total habits', icon: '🏅', id: 'completions', title: 'Steady Progress' });
  return achievements;
}

function getHabitId(value: unknown): string | null {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : null;
}

export function buildCharacterData(habits: HabitLike[], tracking: TrackingLike[]): CharacterData {
  const activeHabits = habits.length;
  const completedByDateByHabit = new Map<string, Set<string>>();
  for (const habit of habits) {
    const habitId = getHabitId(habit._id);
    if (habitId) completedByDateByHabit.set(habitId, new Set<string>());
  }

  let totalCompletions = 0;
  for (const entry of tracking) {
    if (typeof entry?.date !== 'string' || !entry.completed) continue;
    const habitId = getHabitId(entry.habitId);
    const completedDates = habitId ? completedByDateByHabit.get(habitId) : null;
    if (!completedDates) continue;
    completedDates.add(entry.date);
    totalCompletions += 1;
  }

  const today = startOfDay(new Date());
  const todayString = format(today, 'yyyy-MM-dd');
  let dayStreak = 0;
  for (const habit of habits) {
    const completedDates = completedByDateByHabit.get(getHabitId(habit._id) ?? '');
    if (!completedDates) continue;
    let streak = 0;
    const cursor = new Date(today);
    while (completedDates.has(format(cursor, 'yyyy-MM-dd'))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    if (streak > dayStreak) dayStreak = streak;
  }

  let todayCompletions = 0;
  for (const entry of tracking) {
    const habitId = getHabitId(entry.habitId);
    if (!habitId || !completedByDateByHabit.has(habitId)) continue;
    if (entry.completed && entry.date === todayString) todayCompletions += 1;
  }

  const totalPower = Math.max(0, activeHabits * 4 + dayStreak * 6 + Math.floor(totalCompletions / 2));
  const baseXp = Math.max(0, totalCompletions * 4 + dayStreak * 10 + todayCompletions);
  const xpToNextLevel = 120;
  return {
    attributes: buildAttributes(activeHabits, dayStreak, totalCompletions),
    level: Math.max(1, Math.floor(baseXp / xpToNextLevel) + 1),
    recentAchievements: buildAchievements(activeHabits, dayStreak, totalCompletions),
    stats: { activeHabits, dayStreak, totalPower },
    title: 'Habit Hero',
    xp: baseXp % xpToNextLevel,
    xpToNextLevel,
  };
}
