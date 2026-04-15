import { useCallback } from 'react';
import type { Habit } from '../types';

interface SecondaryModalSetters {
  setShowQuickActions: (v: boolean) => void;
  setQuickActionsHabit: (h: Habit | null) => void;
  setSelectedHabit: (h: Habit | null) => void;
  setShowVisualizationExercise: (v: boolean) => void;
  setShowActivationModal: (v: boolean) => void;
  setActivationModalHabit: (h: Habit | null) => void;
}

interface SecondaryModalDeps {
  habits: Habit[];
}

/**
 * Handles secondary modal interactions: quick actions,
 * visualization exercise, and activation modals.
 */
export function useSecondaryModalHandlers(
  setters: SecondaryModalSetters,
  deps: SecondaryModalDeps
) {
  const openQuickActions = useCallback((habit: Habit) => {
    setters.setQuickActionsHabit(habit);
    setters.setShowQuickActions(true);
  }, []);

  const closeQuickActions = useCallback(() => {
    setters.setShowQuickActions(false);
    setters.setQuickActionsHabit(null);
  }, []);

  const openVisualizationExercise = useCallback((habit: Habit) => {
    setters.setSelectedHabit(habit);
    setters.setShowVisualizationExercise(true);
  }, []);

  const closeVisualizationExercise = useCallback(() => {
    setters.setShowVisualizationExercise(false);
  }, []);

  const openActivationModal = useCallback((habit: Habit) => {
    setters.setActivationModalHabit(habit);
    setters.setShowActivationModal(true);
  }, []);

  const openActivationModalById = useCallback(
    (habitId: string) => {
      const habit = deps.habits.find((h) => h._id === habitId);
      if (habit) {
        setters.setActivationModalHabit(habit);
        setters.setShowActivationModal(true);
      }
    },
    [deps.habits]
  );

  const closeActivationModal = useCallback(() => {
    setters.setShowActivationModal(false);
    setters.setActivationModalHabit(null);
  }, []);

  return {
    closeActivationModal,
    closeQuickActions,
    closeVisualizationExercise,
    openActivationModal,
    openActivationModalById,
    openQuickActions,
    openVisualizationExercise,
  };
}
