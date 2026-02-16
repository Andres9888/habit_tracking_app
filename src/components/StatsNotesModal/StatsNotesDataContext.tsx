/**
 * StatsNotesDataContext
 * 
 * Consolidates data fetching for StatsNotesModal to prevent query storm.
 * Addresses performance issue #3 - 8+ queries triggered on modal mount
 * 
 * Single shared query for tracking data, filtered client-side for different views
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useQuery } from 'convex/react';
import { format, startOfDay, subDays } from 'date-fns';
import { api } from '../../../convex/_generated/api';
import { useHabitsData } from '../../contexts/HabitsDataContext';

interface StatsNotesDataContextValue {
  habits: ReturnType<typeof useHabitsData>['habits'];
  tracking30Days: Array<{ habitId: string; date: string; completed: boolean }>;
  tracking7Days: Array<{ habitId: string; date: string; completed: boolean }>;
  trackingToday: Array<{ habitId: string; date: string; completed: boolean }>;
  last30Days: string[];
  last7Days: string[];
  today: Date;
  todayString: string;
  isLoading: boolean;
}

const StatsNotesDataContext = createContext<StatsNotesDataContextValue | undefined>(undefined);

export function StatsNotesDataProvider({ children }: { children: ReactNode }) {
  const { habits, isLoading: habitsLoading } = useHabitsData();
  
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayString = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);

  const last30Days = useMemo(
    () => Array.from({ length: 30 }, (_, i) => format(subDays(today, 29 - i), 'yyyy-MM-dd')),
    [today]
  );

  const last7Days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => format(subDays(today, i), 'yyyy-MM-dd')),
    [today]
  );

  // Single query for all tracking data (30 days)
  const tracking30Query = useQuery(
    api.habits.getTracking,
    { dates: last30Days }
  );

  const tracking30Days = Array.isArray(tracking30Query) ? tracking30Query : [];
  
  // Filter tracking data client-side for different time ranges
  const tracking7Days = useMemo(
    () => {
      const last7Set = new Set(last7Days);
      return tracking30Days.filter((t) => last7Set.has(t.date));
    },
    [tracking30Days, last7Days]
  );

  const trackingToday = useMemo(
    () => tracking30Days.filter((t) => t.date === todayString),
    [tracking30Days, todayString]
  );

  const value: StatsNotesDataContextValue = {
    habits,
    isLoading: habitsLoading || tracking30Query === undefined,
    last30Days,
    last7Days,
    today,
    todayString,
    tracking30Days,
    tracking7Days,
    trackingToday,
  };

  return (
    <StatsNotesDataContext.Provider value={value}>
      {children}
    </StatsNotesDataContext.Provider>
  );
}

export function useStatsNotesData() {
  const context = useContext(StatsNotesDataContext);
  if (context === undefined) {
    throw new Error('useStatsNotesData must be used within StatsNotesDataProvider');
  }
  return context;
}
