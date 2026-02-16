/**
 * SettingsContext
 * 
 * Centralized provider for settings data to eliminate duplicate queries.
 * Addresses performance issue #2 - 5+ duplicate api.settings.get queries
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { HabitSettings } from '../features/habits/types';

interface SettingsContextValue {
  settings: HabitSettings | undefined;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const settingsQuery = useQuery(api.settings.get);
  
  const value: SettingsContextValue = {
    settings: settingsQuery as HabitSettings | undefined,
    isLoading: settingsQuery === undefined,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
