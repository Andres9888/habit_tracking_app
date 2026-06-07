import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
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
};

export interface ProfileStatsState {
  isLoading: boolean;
  stats: ProfileStats;
}

export function useProfileStats(): ProfileStatsState {
  const habitsQuery = useQuery(api.habits.list);
  const habits = Array.isArray(habitsQuery) ? habitsQuery : [];
  const habitsLoading = habitsQuery === undefined;

  const startDate =
    habits.length > 0 ? getProfileTrackingStartDate(habits) : null;
  const trackingQuery = useQuery(
    api.habits.getTracking,
    startDate ? { endDate: getLocalDateString(), startDate } : 'skip'
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
