import { useCallback, useMemo } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettingsUpdate } from '../types';
import type { HabitModalDeps, HabitModalSetters } from './useHabitModalHandlers.types';
import { DEFAULT_SETTINGS } from '../../../../convex/settings/types';
import { showGenericError, showSaveError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';
import { updateSettingsWithFallback } from '../../../lib/settings/updateSettingsWithFallback';

export function useHabitModalHandlers(
  setters: HabitModalSetters,
  deps: HabitModalDeps
) {
  const openHabitDetail = useCallback(
    (habit: Habit, initialTab: 'progress' | 'motivation' | 'manage' = 'progress') => {
      setters.setSelectedHabit(habit);
      setters.setHabitDetailInitialTab(initialTab);
      setters.setIsHabitDetailOpen(true);
    },
    []
  );

  const openHabitCalendar = useCallback((habit: Habit) => { setters.setSelectedHabit(habit); setters.setIsHabitCalendarOpen(true); }, []);

  const openPauseModal = useCallback(
    (habitId: Id<'habits'>) => {
      const habit = deps.habits.find((h) => h._id === habitId);
      if (habit) {
        setters.setHabitToPause(habit);
        setters.setShowPauseModal(true);
      }
    },
    [deps.habits]
  );

  const confirmPause = useCallback(async () => {
    if (!deps.habitToPause) return;
    try {
      await deps.pauseHabit({ habitId: deps.habitToPause._id });
      setters.setShowPauseModal(false);
      setters.setHabitToPause(null);
      setters.setIsHabitDetailOpen(false);
    } catch (error) {
      if (__DEV__) console.error('Failed to pause habit:', error);
      showGenericError('Failed to pause habit. Please try again.');
    }
  }, [deps.habitToPause, deps.pauseHabit]);

  const openEditHabit = useCallback((habit: Habit | null) => { setters.setHabitToEdit(habit); if (habit) setters.setShowEditScreen(true); }, []);

  const closeEditScreen = useCallback(() => { setters.setShowEditScreen(false); setters.setHabitToEdit(null); }, []);

  const openCreateHabitScreen = useCallback(() => { setters.setIsCreateHabitOpen(true); setters.setHabitToEdit(null); }, []);

  const closeCreateHabit = useCallback(() => { setters.setIsCreateHabitOpen(false); setters.setHabitToEdit(null); }, []);

  const onSettingsChange = useCallback(
    async (updates: Partial<HabitSettingsUpdate>) => {
      try {
        const baseSettings = (deps.settings ??
          DEFAULT_SETTINGS) as unknown as Record<string, unknown>;
        await updateSettingsWithFallback(
          deps.updateSettings as unknown as (
            args: Record<string, unknown>
          ) => Promise<unknown>,
          {
            ...baseSettings,
            ...updates,
          }
        );
      } catch (error) {
        if (__DEV__) console.error('Failed to update settings:', error);
        showSaveError();
      }
    },
    [deps.settings, deps.updateSettings]
  );

  const onDeleteHabit = useCallback(
    async (habitId: Id<'habits'>) => {
      try {
        await deps.removeHabit({ habitId });
        setters.setIsHabitDetailOpen(false);
        setters.setSelectedHabit(null);
      } catch (error) {
        if (__DEV__) console.error('Failed to delete habit:', error);
        showGenericError(ERROR_MESSAGES.DATA_OPS.DELETE_HABIT_FAILED);
      }
    },
    [deps.removeHabit]
  );

  // Memoised: every handler above is already stable, so the container object
  // must be too or the whole modals state object churns on every render.
  return useMemo(
    () => ({
      closeCreateHabit,
      closeEditScreen,
      confirmPause,
      onDeleteHabit,
      onSettingsChange,
      openCreateHabitScreen,
      openEditHabit,
      openHabitCalendar,
      openHabitDetail,
      openPauseModal,
    }),
    [
      closeCreateHabit,
      closeEditScreen,
      confirmPause,
      onDeleteHabit,
      onSettingsChange,
      openCreateHabitScreen,
      openEditHabit,
      openHabitCalendar,
      openHabitDetail,
      openPauseModal,
    ]
  );
}
