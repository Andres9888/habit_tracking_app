import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type {
  Habit,
  HabitSettings,
  HabitSettingsUpdate,
  ShareCardData,
} from '../types';

interface ModalsSetters {
  setIsCreateHabitOpen: (v: boolean) => void;
  setHabitToEdit: (h: Habit | null) => void;
  setShowShareCard: (v: boolean) => void;
  setShareCardData: (d: ShareCardData | null) => void;
  setSelectedHabit: (h: Habit | null) => void;
  setHabitDetailInitialTab: (t: 'progress' | 'motivation' | 'manage') => void;
  setIsHabitDetailOpen: (v: boolean) => void;
  setIsHabitCalendarOpen: (v: boolean) => void;
  setHabitToPause: (h: Habit | null) => void;
  setShowPauseModal: (v: boolean) => void;
  setShowEditScreen: (v: boolean) => void;
  setShowQuickActions: (v: boolean) => void;
  setQuickActionsHabit: (h: Habit | null) => void;
  setShowVisualizationExercise: (v: boolean) => void;
  setShowActivationModal: (v: boolean) => void;
  setActivationModalHabit: (h: Habit | null) => void;
}

interface ModalsHandlersDeps {
  habits: Habit[];
  settings: HabitSettings | undefined;
  clearMilestone: () => void;
  updateSettings: (s: HabitSettings) => Promise<void>;
  removeHabit: (args: { habitId: Id<'habits'> }) => Promise<void>;
  pauseHabit: (args: { habitId: Id<'habits'> }) => Promise<void>;
  habitToPause: Habit | null;
}

export function useHabitsModalsHandlers(
  setters: ModalsSetters,
  deps: ModalsHandlersDeps
) {
  const {
    habits,
    settings,
    clearMilestone,
    updateSettings,
    removeHabit,
    pauseHabit,
    habitToPause,
  } = deps;

  const closeCreateHabit = useCallback(() => {
    setters.setIsCreateHabitOpen(false);
    setters.setHabitToEdit(null);
  }, []);

  const closeShareCard = useCallback(() => {
    setters.setShowShareCard(false);
    setters.setShareCardData(null);
    clearMilestone();
  }, [clearMilestone]);

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
      const habit = habits.find((h) => h._id === habitId);
      if (habit) {
        setters.setHabitToPause(habit);
        setters.setShowPauseModal(true);
      }
    },
    [habits]
  );

  const openEditHabit = useCallback((habit: Habit | null) => {
    setters.setHabitToEdit(habit);
    if (habit) {
      setters.setShowEditScreen(true);
    }
  }, []);

  const closeEditScreen = useCallback(() => {
    setters.setShowEditScreen(false);
    setters.setHabitToEdit(null);
  }, []);

  const openCreateHabitScreen = useCallback(() => {
    setters.setIsCreateHabitOpen(true);
    setters.setHabitToEdit(null);
  }, []);

  const onSettingsChange = useCallback(
    async (updates: Partial<HabitSettingsUpdate>) => {
      if (!settings) return;
      await updateSettings({ ...settings, ...updates });
    },
    [settings, updateSettings]
  );

  const onDeleteHabit = useCallback(
    async (habitId: Id<'habits'>) => {
      await removeHabit({ habitId });
      setters.setIsHabitDetailOpen(false);
      setters.setSelectedHabit(null);
    },
    [removeHabit]
  );

  const confirmPause = useCallback(async () => {
    if (!habitToPause) return;
    await pauseHabit({ habitId: habitToPause._id });
    setters.setShowPauseModal(false);
    setters.setHabitToPause(null);
    setters.setIsHabitDetailOpen(false);
  }, [habitToPause, pauseHabit]);

  // Quick Actions
  const openQuickActions = useCallback((habit: Habit) => {
    setters.setQuickActionsHabit(habit);
    setters.setShowQuickActions(true);
  }, []);

  const closeQuickActions = useCallback(() => {
    setters.setShowQuickActions(false);
    setters.setQuickActionsHabit(null);
  }, []);

  // Visualization Exercise
  const openVisualizationExercise = useCallback((habit: Habit) => {
    setters.setSelectedHabit(habit);
    setters.setShowVisualizationExercise(true);
  }, []);

  const closeVisualizationExercise = useCallback(() => {
    setters.setShowVisualizationExercise(false);
  }, []);

  // Activation Modal
  const openActivationModal = useCallback((habit: Habit) => {
    setters.setActivationModalHabit(habit);
    setters.setShowActivationModal(true);
  }, []);

  const openActivationModalById = useCallback(
    (habitId: string) => {
      const habit = habits.find((h) => h._id === habitId);
      if (habit) {
        setters.setActivationModalHabit(habit);
        setters.setShowActivationModal(true);
      }
    },
    [habits]
  );

  const closeActivationModal = useCallback(() => {
    setters.setShowActivationModal(false);
    setters.setActivationModalHabit(null);
  }, []);

  const onShareMilestone = useCallback((data: ShareCardData) => {
    setters.setShareCardData(data);
    setters.setShowShareCard(true);
  }, []);

  return {
    closeCreateHabit,
    closeEditScreen,
    closeShareCard,
    closeQuickActions,
    confirmPause,
    closeVisualizationExercise,
    onSettingsChange,
    onDeleteHabit,
    openEditHabit,
    closeActivationModal,
    openHabitCalendar,
    onShareMilestone,
    openHabitDetail,
    openActivationModal,
    openPauseModal,
    openActivationModalById,
    openCreateHabitScreen,
    openQuickActions,
    openVisualizationExercise,
  };
}
