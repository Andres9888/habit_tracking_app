/**
 * StreakGoalCard Hooks — Variation K (Dashboard)
 *
 * Computes overall progress + a fully-enriched milestone list
 * (status, date, daysAway) including the goal-day row.
 */

import { useMemo } from 'react';

import { MILESTONES } from '../MilestoneProgressTypes';
import type { DashboardMilestone } from './StreakGoalCard.types';

const MS_PER_DAY = 86_400_000;

function daysFromToday(offsetDays: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setTime(d.getTime() + offsetDays * MS_PER_DAY);
  return d;
}

function buildMilestone(
  days: number,
  badge: string,
  name: string,
  currentStreak: number,
  isGoalRow = false
): DashboardMilestone {
  const achieved = currentStreak >= days;
  const offset = achieved
    ? -(currentStreak - days)
    : days - currentStreak;
  const daysAway = achieved ? 0 : days - currentStreak;
  const isCurrent = !achieved;
  return {
    badge,
    date: daysFromToday(offset),
    days,
    daysAway,
    isGoalRow,
    name,
    status: achieved ? 'done' : isCurrent ? 'current' : 'future',
  };
}

export function useStreakGoalData(currentStreak: number, streakGoal: number) {
  return useMemo(() => {
    const overallPercent =
      streakGoal > 0
        ? Math.min(Math.round((currentStreak / streakGoal) * 100), 100)
        : 0;
    const daysRemaining = Math.max(streakGoal - currentStreak, 0);
    const projectedDate = daysFromToday(daysRemaining);

    const inRange = MILESTONES.filter((m) => m.days <= streakGoal);
    const enriched = inRange.map((m) =>
      buildMilestone(m.days, m.badge, m.name, currentStreak)
    );

    const goalIsStandard = inRange.some((m) => m.days === streakGoal);
    if (!goalIsStandard && streakGoal > 0) {
      enriched.push(
        buildMilestone(streakGoal, '🎯', 'Goal', currentStreak, true)
      );
    }

    let firstFutureMarked = false;
    const milestones: DashboardMilestone[] = enriched.map((m) => {
      if (m.status === 'done') return m;
      if (!firstFutureMarked) {
        firstFutureMarked = true;
        return { ...m, status: 'current' };
      }
      return { ...m, status: 'future' };
    });

    return { daysRemaining, milestones, overallPercent, projectedDate };
  }, [currentStreak, streakGoal]);
}
