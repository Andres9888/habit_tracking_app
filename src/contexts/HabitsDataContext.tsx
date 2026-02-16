/**
 * HabitsDataContext
 * 
 * Centralized provider for habits list data to eliminate duplicate queries.
 * Addresses performance issue #1 - 6+ duplicate api.habits.list queries
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

export interface Habit {
  _id: Id<'habits'>;
  _creationTime: number;
  userId: string;
  name: string;
  color: string;
  icon: string;
  frequency: string;
  archived?: boolean;
  pausedUntil?: string;
  order?: number;
  goal?: number;
  unit?: string;
}

interface HabitsDataContextValue {
  habits: Habit[];
  isLoading: boolean;
}

const HabitsDataContext = createContext<HabitsDataContextValue | undefined>(undefined);

export function HabitsDataProvider({ children }: { children: ReactNode }) {
  const habitsQuery = useQuery(api.habits.list);
  
  const value: HabitsDataContextValue = {
    habits: Array.isArray(habitsQuery) ? habitsQuery : [],
    isLoading: habitsQuery === undefined,
  };

  return (
    <HabitsDataContext.Provider value={value}>
      {children}
    </HabitsDataContext.Provider>
  );
}

export function useHabitsData() {
  const context = useContext(HabitsDataContext);
  if (context === undefined) {
    throw new Error('useHabitsData must be used within HabitsDataProvider');
  }
  return context;
}
