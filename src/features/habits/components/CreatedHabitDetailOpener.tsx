/**
 * Opens the detail screen for a habit the regular add-habit form just
 * created — the same exit the Habit Library's view-habit path uses.
 *
 * Waits for two things: the server habit (the optimistic row's temp id is
 * not a valid document id for habits.get) and the form's exit animation
 * (iOS will not present a second native modal while one is dismissing).
 */

import { useEffect, useMemo } from 'react';
import { isOptimisticHabitId } from '../hooks/optimisticHabitCreationStore';
import type { HabitsModalsState } from '../hooks/types';

interface CreatedHabitDetailOpenerProps {
  modals: HabitsModalsState;
}

export function useOpenCreatedHabitDetail(modals: HabitsModalsState) {
  const {
    clearCreatedHabitDetail,
    createdHabitDetailRequest: request,
    habits,
    openHabitDetail,
  } = modals;
  const id = request?.id ?? null;
  const notBefore = request?.notBefore ?? 0;
  const hasOpenModal =
    modals.showCreateHabit ||
    modals.showHabitDetail ||
    modals.showHabitCalendar ||
    modals.showSettings ||
    modals.showTemplatesScreen ||
    modals.showEditScreen ||
    modals.showQuickActions ||
    modals.showShareCard ||
    modals.showPauseModal ||
    modals.showHapticTest ||
    modals.showVisualizationExercise;

  const habit = useMemo(() => {
    if (!id || isOptimisticHabitId(id)) return null;
    return habits.find((item) => item._id === id) ?? null;
  }, [habits, id]);

  useEffect(() => {
    if (!request) return;
    // Navigation takes precedence even while the server habit is pending.
    // Clear permanently so closing that screen cannot revive the redirect.
    if (hasOpenModal) {
      clearCreatedHabitDetail();
      return;
    }
    if (!habit) return;
    const timer = setTimeout(
      () => {
        clearCreatedHabitDetail();
        openHabitDetail(habit);
      },
      Math.max(0, notBefore - Date.now())
    );
    return () => clearTimeout(timer);
  }, [
    clearCreatedHabitDetail,
    habit,
    hasOpenModal,
    notBefore,
    openHabitDetail,
    request,
  ]);
}

export function CreatedHabitDetailOpener({
  modals,
}: CreatedHabitDetailOpenerProps) {
  useOpenCreatedHabitDetail(modals);
  return null;
}

export default CreatedHabitDetailOpener;
