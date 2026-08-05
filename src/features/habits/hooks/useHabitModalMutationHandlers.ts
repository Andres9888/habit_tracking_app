/**
 * Offline-aware pause / delete / settings handlers for the habit modals.
 * Extracted from useHabitModalHandlers to keep each file focused and small.
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { HabitSettingsUpdate } from '../types';
import type { HabitModalDeps, HabitModalSetters } from './useHabitModalHandlers.types';
import { DEFAULT_SETTINGS } from '../../../../convex/settings/types';
import { showGenericError, showSaveError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';
import { updateSettingsOfflineAware } from '../../../lib/settings/updateSettingsOfflineAware';
import { deleteHabitOffline, pauseHabitOffline } from './offlineHabitMutations';

export function useHabitModalMutationHandlers(
  setters: HabitModalSetters,
  deps: HabitModalDeps,
  isOnline: boolean
) {
  const confirmPause = useCallback(async () => {
    if (!deps.habitToPause) return;
    await pauseHabitOffline({
      habitId: deps.habitToPause._id,
      habitName: deps.habitToPause.name,
      isOnline,
      onError: (error) => {
        if (__DEV__) console.error('Failed to pause habit:', error);
        showGenericError('Failed to pause habit. Please try again.');
      },
      pauseMutation: deps.pauseHabit,
    });
    setters.setShowPauseModal(false);
    setters.setHabitToPause(null);
    setters.setIsHabitDetailOpen(false);
  }, [deps.habitToPause, deps.pauseHabit, isOnline]);

  const onSettingsChange = useCallback(
    async (updates: Partial<HabitSettingsUpdate>) => {
      try {
        const baseSettings = (deps.settings ??
          DEFAULT_SETTINGS) as unknown as Record<string, unknown>;
        await updateSettingsOfflineAware(
          deps.updateSettings as unknown as (
            args: Record<string, unknown>
          ) => Promise<unknown>,
          { ...baseSettings, ...updates },
          isOnline
        );
      } catch (error) {
        if (__DEV__) console.error('Failed to update settings:', error);
        showSaveError();
      }
    },
    [deps.settings, deps.updateSettings, isOnline]
  );

  const onDeleteHabit = useCallback(
    async (habitId: Id<'habits'>) => {
      const habit = deps.habits.find((h) => h._id === habitId);
      await deleteHabitOffline({
        habitId,
        habitName: habit?.name ?? 'Habit',
        isOnline,
        onError: (error) => {
          if (__DEV__) console.error('Failed to delete habit:', error);
          showGenericError(ERROR_MESSAGES.DATA_OPS.DELETE_HABIT_FAILED);
        },
        removeMutation: deps.removeHabit,
      });
      setters.setIsHabitDetailOpen(false);
      setters.setSelectedHabit(null);
    },
    [deps.habits, deps.removeHabit, isOnline]
  );

  return { confirmPause, onDeleteHabit, onSettingsChange };
}
