/**
 * useWeeklyInsights Hook
 * Calculates weekly habit insights from tracking data
 */

import { useMemo } from 'react';

interface HabitWithTracking {
  _id: string;
  currentStreak?: number;
  completedToday?: boolean;
}

interface TrackingRecord {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

interface UseWeeklyInsightsResult {
  completionRate: number;
  bestDay: number;
  totalCompleted: number;
  totalPossible: number;
  streaksAtRisk: number;
  trend: 'up' | 'down' | 'same';
  isLoading: boolean;
}

function getWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dates: string[] = [];
  
  // Get dates from Sunday to today
  for (let i = 0; i <= dayOfWeek; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

function getLastWeekDates(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dates: string[] = [];
  
  // Get dates from last Sunday to last Saturday
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - dayOfWeek - 7 + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

export function useWeeklyInsights(
  habits: HabitWithTracking[],
  trackingRecords: TrackingRecord[]
): UseWeeklyInsightsResult {
  return useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        completionRate: 0,
        bestDay: 0,
        totalCompleted: 0,
        totalPossible: 0,
        streaksAtRisk: 0,
        trend: 'same',
        isLoading: false,
      };
    }

    const weekDates = getWeekDates();
    const lastWeekDates = getLastWeekDates();
    const today = new Date().toISOString().split('T')[0];
    
    // Create lookup for tracking records
    const trackingLookup = new Map<string, boolean>();
    for (const record of trackingRecords) {
      trackingLookup.set(`${record.habitId}-${record.date}`, record.completed);
    }
    
    // Calculate this week's stats
    const dayCompletions: number[] = [0, 0, 0, 0, 0, 0, 0];
    let totalCompleted = 0;
    let totalPossible = 0;
    
    for (const date of weekDates) {
      const dayOfWeek = new Date(date).getDay();
      for (const habit of habits) {
        totalPossible++;
        const key = `${habit._id}-${date}`;
        if (trackingLookup.get(key)) {
          dayCompletions[dayOfWeek]++;
          totalCompleted++;
        }
      }
    }
    
    // Find best day
    let bestDay = 0;
    let maxCompletions = 0;
    for (let i = 0; i < dayCompletions.length; i++) {
      if (dayCompletions[i] > maxCompletions) {
        maxCompletions = dayCompletions[i];
        bestDay = i;
      }
    }
    
    // Calculate last week's completion rate
    let lastWeekCompleted = 0;
    let lastWeekPossible = 0;
    for (const date of lastWeekDates) {
      for (const habit of habits) {
        lastWeekPossible++;
        const key = `${habit._id}-${date}`;
        if (trackingLookup.get(key)) {
          lastWeekCompleted++;
        }
      }
    }
    
    const thisWeekRate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
    const lastWeekRate = lastWeekPossible > 0 ? (lastWeekCompleted / lastWeekPossible) * 100 : 0;
    
    // Determine trend
    let trend: 'up' | 'down' | 'same' = 'same';
    if (thisWeekRate > lastWeekRate + 5) {
      trend = 'up';
    } else if (thisWeekRate < lastWeekRate - 5) {
      trend = 'down';
    }
    
    // Count streaks at risk (habits with streaks not completed today)
    let streaksAtRisk = 0;
    for (const habit of habits) {
      const hasStreak = (habit.currentStreak ?? 0) > 0;
      const completedToday = trackingLookup.get(`${habit._id}-${today}`) || habit.completedToday;
      if (hasStreak && !completedToday) {
        streaksAtRisk++;
      }
    }
    
    return {
      completionRate: Math.round(thisWeekRate),
      bestDay,
      totalCompleted,
      totalPossible,
      streaksAtRisk,
      trend,
      isLoading: false,
    };
  }, [habits, trackingRecords]);
}
