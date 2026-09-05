import { useMemo } from 'react';
import { useSettingsQuery } from '../../../lib/settings/useSettingsQuery';
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
  reduceMotionPreference: boolean;
}

/**
 * Fetches and derives settings state for habits feature.
 * Extracted from useHabitsModalsState for decomposition.
 *
 * The archived-habit count is owned by `SettingsModalSection`: querying it
 * here, keyed on the settings-open flag, re-rendered the whole Home tree
 * every time the count arrived.
 */
export function useHabitsSettings(): HabitsSettingsResult {
  const settingsQuery = useSettingsQuery();
  const settings = (settingsQuery ?? DEFAULT_SETTINGS) as
    | HabitsSettingsDocument
    | undefined;

  return useMemo(
    () => ({
      celebrationsEnabled: settings?.showMotivationalMessages ?? true,
      completionSoundEnabled: settings?.completionSoundEnabled ?? false,
      completionSoundType: settings?.completionSoundType ?? 'chime',
      reduceMotionPreference: settings?.reduceMotion ?? false,
      settings,
    }),
    [settings]
  );
}
