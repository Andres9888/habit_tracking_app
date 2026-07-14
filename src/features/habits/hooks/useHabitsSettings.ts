import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
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

interface UseHabitsSettingsOptions {
  settings: HabitsSettingsDocument | undefined;
  shouldLoadArchivedCount: boolean;
}

/**
 * Fetches and derives settings state for habits feature.
 * Extracted from useHabitsModalsState for decomposition.
 */
export function useHabitsSettings({
  settings,
  shouldLoadArchivedCount,
}: UseHabitsSettingsOptions): HabitsSettingsResult {
  const archivedHabitsCountQuery = useQuery(
    api.habits.listArchivedCount,
    shouldLoadArchivedCount ? {} : 'skip'
  );
  // Do not substitute DEFAULT_SETTINGS for a missing query — that pretends
  // the user chose product defaults and causes a preference flash when live
  // settings arrive. Gate consumers on settings !== undefined.
  const archivedHabitsCount = archivedHabitsCountQuery ?? 0;

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
