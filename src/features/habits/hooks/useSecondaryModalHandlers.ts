import { useCallback, useMemo } from 'react';
import type { Habit, ShareCardData } from '../types';

interface SecondaryModalSetters {
  setShowShareCard: (v: boolean) => void;
  setShareCardData: (d: ShareCardData | null) => void;
  setShowQuickActions: (v: boolean) => void;
  setQuickActionsHabit: (h: Habit | null) => void;
  setSelectedHabit: (h: Habit | null) => void;
  setShowVisualizationExercise: (v: boolean) => void;
}

interface SecondaryModalDeps {
  habits: Habit[];
  clearMilestone: () => void;
}

/**
 * Handles secondary modal interactions: share, quick actions,
 * visualization exercise, and activation modals.
 */
export function useSecondaryModalHandlers(
  setters: SecondaryModalSetters,
  deps: SecondaryModalDeps
) {
  const closeShareCard = useCallback(() => {
    setters.setShowShareCard(false);
    setters.setShareCardData(null);
    deps.clearMilestone();
  }, [deps.clearMilestone]);

  const onShareMilestone = useCallback((data: ShareCardData) => {
    setters.setShareCardData(data);
    setters.setShowShareCard(true);
  }, []);

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

  // Memoised for the same reason as useHabitModalHandlers: a fresh container
  // object would defeat the memoisation of the modals state above it.
  return useMemo(
    () => ({
      closeQuickActions,
      closeShareCard,
      closeVisualizationExercise,
      onShareMilestone,
      openQuickActions,
      openVisualizationExercise,
    }),
    [
      closeQuickActions,
      closeShareCard,
      closeVisualizationExercise,
      onShareMilestone,
      openQuickActions,
      openVisualizationExercise,
    ]
  );
}
