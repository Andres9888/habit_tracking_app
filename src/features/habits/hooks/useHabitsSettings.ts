import { useQuery } from 'convex/react';
import { useMemo, useRef } from 'react';
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
export function useHabitsSettings(
  loadArchivedCount = false
): HabitsSettingsResult {
  const settingsQuery = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  const liveArchivedHabitsCount = useQuery(
    api.habits.listArchivedCount,
    loadArchivedCount ? {} : 'skip'
  );
  const lastArchivedHabitsCountRef = useRef(0);
  if (liveArchivedHabitsCount !== undefined) {
    lastArchivedHabitsCountRef.current = liveArchivedHabitsCount;
  }
  const settings = (settingsQuery ?? DEFAULT_SETTINGS) as
    | HabitsSettingsDocument
    | undefined;
  const archivedHabitsCount =
    liveArchivedHabitsCount ?? lastArchivedHabitsCountRef.current;

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
