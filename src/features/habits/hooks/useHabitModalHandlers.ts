import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import type { HabitModalDeps, HabitModalSetters } from './useHabitModalHandlers.types';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { useHabitModalMutationHandlers } from './useHabitModalMutationHandlers';

export function useHabitModalHandlers(
  setters: HabitModalSetters,
  deps: HabitModalDeps
) {
  const isOnline = useIsOnline();
  const { confirmPause, onDeleteHabit, onSettingsChange } =
    useHabitModalMutationHandlers(setters, deps, isOnline);

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

  const openEditHabit = useCallback((habit: Habit | null) => { setters.setHabitToEdit(habit); if (habit) setters.setShowEditScreen(true); }, []);

  const closeEditScreen = useCallback(() => { setters.setShowEditScreen(false); setters.setHabitToEdit(null); }, []);

  const openCreateHabitScreen = useCallback(() => { setters.setIsCreateHabitOpen(true); setters.setHabitToEdit(null); }, []);

  const closeCreateHabit = useCallback(() => { setters.setIsCreateHabitOpen(false); setters.setHabitToEdit(null); }, []);

  return {
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
  };
}
