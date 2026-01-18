import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { HabitSettings } from '../types';

export interface HabitsSettingsResult {
  settings: HabitSettings | undefined;
  celebrationsEnabled: boolean;
  reduceMotionPreference: boolean;
}

/**
 * Fetches and derives settings state for habits feature.
 * Extracted from useHabitsModalsState for decomposition.
 */
export function useHabitsSettings(): HabitsSettingsResult {
  const settingsQuery = useQuery(api.settings.get);
  const settings = (settingsQuery ?? undefined) as HabitSettings | undefined;

  return useMemo(
    () => ({
      celebrationsEnabled: settings?.showMotivationalMessages ?? true,
      reduceMotionPreference: settings?.reduceMotion ?? false,
      settings,
    }),
    [settings]
  );
}
