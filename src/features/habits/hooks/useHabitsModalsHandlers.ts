
import type { Habit, HabitSettings, ShareCardData } from '../types';
import type { Id } from '../../../../convex/_generated/dataModel';
import { useHabitModalHandlers } from './useHabitModalHandlers';
import { useSecondaryModalHandlers } from './useSecondaryModalHandlers';

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
  const habitHandlers = useHabitModalHandlers(
    {
      setHabitDetailInitialTab: setters.setHabitDetailInitialTab,
      setHabitToEdit: setters.setHabitToEdit,
      setHabitToPause: setters.setHabitToPause,
      setIsCreateHabitOpen: setters.setIsCreateHabitOpen,
      setIsHabitCalendarOpen: setters.setIsHabitCalendarOpen,
      setIsHabitDetailOpen: setters.setIsHabitDetailOpen,
      setSelectedHabit: setters.setSelectedHabit,
      setShowEditScreen: setters.setShowEditScreen,
      setShowPauseModal: setters.setShowPauseModal,
    },
    {
      habits: deps.habits,
      habitToPause: deps.habitToPause,
      pauseHabit: deps.pauseHabit,
      removeHabit: deps.removeHabit,
      settings: deps.settings,
      updateSettings: deps.updateSettings,
    }
  );

  const secondaryHandlers = useSecondaryModalHandlers(
    {
      setActivationModalHabit: setters.setActivationModalHabit,
      setQuickActionsHabit: setters.setQuickActionsHabit,
      setSelectedHabit: setters.setSelectedHabit,
      setShareCardData: setters.setShareCardData,
      setShowActivationModal: setters.setShowActivationModal,
      setShowQuickActions: setters.setShowQuickActions,
      setShowShareCard: setters.setShowShareCard,
      setShowVisualizationExercise: setters.setShowVisualizationExercise,
    },
    {
      clearMilestone: deps.clearMilestone,
      habits: deps.habits,
    }
  );

  return {
    ...habitHandlers,
    ...secondaryHandlers,
  };
}
