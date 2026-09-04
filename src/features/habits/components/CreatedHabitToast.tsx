/**
 * Post-create feedback on Home for the regular add-habit form.
 *
 * Same surface and exits as the Habit Library's post-add toast:
 * "Go to <name>" scrolls to and highlights the new row (in view — Home is
 * already on screen, so no hidden remount); "Add another habit" reopens the
 * form.
 */

import { useCallback } from 'react';
import { TemplateAddedToast } from '../../../components/TemplateAddedToast';
import { useHaptics } from '../../../utils/haptics/useHaptics';
import type { HabitsModalsState } from '../hooks/types';

interface CreatedHabitToastProps {
  modals: HabitsModalsState;
}

export function CreatedHabitToast({ modals }: CreatedHabitToastProps) {
  const { trigger } = useHaptics();
  const {
    createdHabitCount,
    createdHabitFeedback,
    dismissCreatedHabitFeedback,
    openCreateHabitScreen,
    revealHabitOnHome,
  } = modals;
  const habitId = createdHabitFeedback?.habitId ?? null;

  // Mirrors the library's handleGoToHabit: tap haptic, then reveal. The
  // toast's own exit runs alongside and clears the feedback via onDismiss.
  const handleGoToHabit = useCallback(() => {
    if (!habitId) return;
    trigger('tap');
    revealHabitOnHome(habitId);
  }, [habitId, revealHabitOnHome, trigger]);

  const handleAddAnother = useCallback(() => {
    trigger('tap');
    openCreateHabitScreen();
  }, [openCreateHabitScreen, trigger]);

  return (
    <TemplateAddedToast
      primaryHint='Scrolls to this habit on Today'
      secondaryHint='Opens the new habit form again'
      secondaryLabel='Add another habit'
      sessionImportCount={createdHabitCount}
      templateData={createdHabitFeedback}
      variant='success'
      visible={createdHabitFeedback != null}
      onAddAnother={handleAddAnother}
      onDismiss={dismissCreatedHabitFeedback}
      onViewHabit={handleGoToHabit}
    />
  );
}

export default CreatedHabitToast;
