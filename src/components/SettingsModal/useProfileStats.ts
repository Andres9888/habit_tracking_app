import { useMemo } from 'react';
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';
import { getLocalDateString } from '../../utils/getLocalDateString';
import {
  buildProfileStats,
  getProfileTrackingStartDate,
} from './profileStats.helpers';
import type { ProfileStats } from './profileStats.types';

const EMPTY_STATS: ProfileStats = {
  activeHabits: 0,
  flawlessDays: 0,
  lifetimeCompletions: 0,
  currentStreak: 0,
  weeklyCompletionRate: 0,
};

export interface ProfileStatsState {
  isLoading: boolean;
  stats: ProfileStats;
}

export function useProfileStats(): ProfileStatsState {
  const habitsQuery = useCachedQuery(
    api.habits.list,
    {},
    {
      entryName: 'habits.list',
    }
  );
  const habits = Array.isArray(habitsQuery) ? habitsQuery : [];
  const habitsLoading = habitsQuery === undefined;

  const startDate =
    habits.length > 0 ? getProfileTrackingStartDate(habits) : null;
  const trackingQuery = useCachedQuery(
    api.habits.getTracking,
    startDate ? { endDate: getLocalDateString(), startDate } : 'skip',
    { entryName: 'habits.getTracking', fallbackToLatest: false }
  );
  const tracking = Array.isArray(trackingQuery) ? trackingQuery : [];
  const trackingLoading = startDate !== null && trackingQuery === undefined;

  const stats = useMemo(() => {
    if (habits.length === 0) return EMPTY_STATS;
    return buildProfileStats(habits, tracking);
  }, [habits, tracking]);

  return {
    isLoading: habitsLoading || trackingLoading,
    stats,
  };
}
