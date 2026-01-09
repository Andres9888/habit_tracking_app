import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSettings, HabitSettingsUpdate } from '../types';

interface HabitModalSetters {
  setIsHabitDetailOpen: (v: boolean) => void;
  setIsHabitCalendarOpen: (v: boolean) => void;
  setSelectedHabit: (h: Habit | null) => void;
  setHabitDetailInitialTab: (t: 'progress' | 'motivation' | 'manage') => void;
  setHabitToPause: (h: Habit | null) => void;
  setShowPauseModal: (v: boolean) => void;
  setHabitToEdit: (h: Habit | null) => void;
  setShowEditScreen: (v: boolean) => void;
  setIsCreateHabitOpen: (v: boolean) => void;
}

interface HabitModalDeps {
  habits: Habit[];
  settings: HabitSettings | undefined;
  updateSettings: (s: HabitSettings) => Promise<void>;
  removeHabit: (args: { habitId: Id<'habits'> }) => Promise<void>;
  pauseHabit: (args: { habitId: Id<'habits'> }) => Promise<void>;
  habitToPause: Habit | null;
}

export function useHabitModalHandlers(
  setters: HabitModalSetters,
  deps: HabitModalDeps
) {
  const openHabitDetail = useCallback(
    (
      habit: Habit,
      initialTab: 'progress' | 'motivation' | 'manage' = 'progress'
    ) => {
      setters.setSelectedHabit(habit);
      setters.setHabitDetailInitialTab(initialTab);
      setters.setIsHabitDetailOpen(true);
    },
    []
  );

  const openHabitCalendar = useCallback((habit: Habit) => {
    setters.setSelectedHabit(habit);
    setters.setIsHabitCalendarOpen(true);
  }, []);

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
    await deps.pauseHabit({ habitId: deps.habitToPause._id });
    setters.setShowPauseModal(false);
    setters.setHabitToPause(null);
    setters.setIsHabitDetailOpen(false);
  }, [deps.habitToPause, deps.pauseHabit]);

  const openEditHabit = useCallback((habit: Habit | null) => {
    setters.setHabitToEdit(habit);
    if (habit) setters.setShowEditScreen(true);
  }, []);

  const closeEditScreen = useCallback(() => {
    setters.setShowEditScreen(false);
    setters.setHabitToEdit(null);
  }, []);

  const openCreateHabitScreen = useCallback(() => {
    setters.setIsCreateHabitOpen(true);
    setters.setHabitToEdit(null);
  }, []);

  const closeCreateHabit = useCallback(() => {
    setters.setIsCreateHabitOpen(false);
    setters.setHabitToEdit(null);
  }, []);

  const onSettingsChange = useCallback(
    async (updates: Partial<HabitSettingsUpdate>) => {
      if (!deps.settings) return;
      await deps.updateSettings({ ...deps.settings, ...updates });
    },
    [deps.settings, deps.updateSettings]
  );

  const onDeleteHabit = useCallback(
    async (habitId: Id<'habits'>) => {
      await deps.removeHabit({ habitId });
      setters.setIsHabitDetailOpen(false);
      setters.setSelectedHabit(null);
    },
    [deps.removeHabit]
  );

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
