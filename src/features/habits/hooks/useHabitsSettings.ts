import { useMemo } from 'react';
import { api } from '../../../../convex/_generated/api';
import { useCachedQuery } from '../../../lib/queryCache';
import type { CompletionSoundType } from '../../../../convex/settings/types';
import { DEFAULT_SETTINGS } from '../../../../convex/settings/types';
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
  const settingsQuery = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  const archivedHabits = useCachedQuery(
    api.habits.listArchived,
    {},
    {
      entryName: 'habits.listArchived',
    }
  );
  // Do not substitute DEFAULT_SETTINGS for a missing query — that pretends
  // the user chose product defaults and causes a preference flash when live
  // settings arrive. Gate consumers on settings !== undefined.
  const settings = settingsQuery as HabitsSettingsDocument | undefined;
  const archivedHabitsCount = archivedHabits?.length ?? 0;

  return useMemo(
    () => ({
      archivedHabitsCount,
      celebrationsEnabled:
        settings?.showMotivationalMessages ??
        DEFAULT_SETTINGS.showMotivationalMessages,
      completionSoundEnabled:
        settings?.completionSoundEnabled ??
        DEFAULT_SETTINGS.completionSoundEnabled,
      completionSoundType:
        settings?.completionSoundType ?? DEFAULT_SETTINGS.completionSoundType,
      reduceMotionPreference:
        settings?.reduceMotion ?? DEFAULT_SETTINGS.reduceMotion,
      settings,
    }),
    [archivedHabitsCount, settings]
  );
}
