import { useMemo } from 'react';
import type { DayCompletionStatus } from '../../../../components/CalendarTimeline';

interface HabitWithMeta {
  _id: string;
  strength?: number;
  name?: string;
}

interface HeaderStats {
  averageStrength: number;
  weekOverWeekChange: number;
  insightText: string | undefined;
  insightEmoji: string | undefined;
}

export function useHeaderStats(
  habits: HabitWithMeta[],
  completionByDay: Record<string, DayCompletionStatus>,
  totalHabits: number,
  getStreak?: (habitId: string) => number
): HeaderStats {
  const averageStrength = useMemo(() => {
    if (habits.length === 0) return 0;
    let sum = 0;
    for (const h of habits) sum += (h.strength ?? 0) * 100;
    return sum / habits.length;
  }, [habits]);

  const weekOverWeekChange = useMemo(() => {
    const sorted = Object.keys(completionByDay).sort();
    if (sorted.length === 0 || totalHabits === 0) return 0;
    const rates = sorted.map((k) => {
      const d = completionByDay[k];
      return d.total > 0 ? d.completed / d.total : 0;
    });
    const mid = Math.floor(rates.length / 2);
    const recent = rates.slice(mid);
    const earlier = rates.slice(0, mid);
    const avg = (a: number[]) =>
      a.length > 0 ? a.reduce((x, y) => x + y, 0) / a.length : 0;
    return Math.round((avg(recent) - avg(earlier)) * 100);
  }, [completionByDay, totalHabits]);

  const { insightText, insightEmoji } = useMemo<
    Pick<HeaderStats, 'insightEmoji' | 'insightText'>
  >(() => {
    if (!getStreak || habits.length === 0)
      return { insightEmoji: undefined, insightText: undefined };

    let best = { name: '', streak: 0, strength: 0 };
    for (const h of habits) {
      const s = getStreak(h._id);
      if (s > best.streak) {
        best = {
          name: h.name ?? '',
          streak: s,
          strength: (h.strength ?? 0) * 100,
        };
      }
    }

    if (best.streak >= 3 && best.strength < 60) {
      const daysLeft = Math.ceil((60 - best.strength) / 5);
      return {
        insightEmoji: '🌿',
        insightText: `${best.name} is building — ${daysLeft} more days to Strong`,
      };
    }
    if (best.strength >= 80) {
      return {
        insightEmoji: '⚡',
        insightText: `${best.name} is on autopilot — keep the streak alive!`,
      };
    }
    return { insightEmoji: undefined, insightText: undefined };
  }, [habits, getStreak]);

  return { averageStrength, insightEmoji, insightText, weekOverWeekChange };
}
