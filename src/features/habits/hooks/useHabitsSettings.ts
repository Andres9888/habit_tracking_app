import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { CompletionSoundType } from '../../../../convex/settings/types';
import type { HabitSettings } from '../types';

type HabitsSettingsDocument = HabitSettings & {
  showGradientFill?: boolean;
};

export interface HabitsSettingsResult {
  settings: HabitsSettingsDocument | undefined;
  celebrationsEnabled: boolean;
  completionSoundEnabled: boolean;
  completionSoundType: CompletionSoundType;
  archivedHabitsCount: number;
  reduceMotionPreference: boolean;
}

/**
 * Fetches and derives settings state for habits feature.
 * Extracted from useHabitsModalsState for decomposition.
 */
export function useHabitsSettings(): HabitsSettingsResult {
  const settingsQuery = useQuery(api.settings.get);
  const archivedHabits = useQuery(api.habits.listArchived);
  const settings = (settingsQuery ?? undefined) as
    | HabitsSettingsDocument
    | undefined;
  const archivedHabitsCount = archivedHabits?.length ?? 0;

  return useMemo(
    () => ({
      archivedHabitsCount,
      celebrationsEnabled: settings?.showMotivationalMessages ?? true,
      completionSoundEnabled: settings?.completionSoundEnabled ?? false,
      completionSoundType: settings?.completionSoundType ?? 'chime',
      reduceMotionPreference: settings?.reduceMotion ?? false,
      settings,
    }),
    [archivedHabitsCount, settings]
  );
}
