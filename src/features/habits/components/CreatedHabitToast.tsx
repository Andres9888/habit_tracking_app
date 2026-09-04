/**
 * Post-create feedback on Home for the regular add-habit form.
 *
 * Same surface as the Habit Library's post-add toast. "Go to <name>" opens
 * the habit's detail screen; "Add another habit" reopens the form.
 *
 * Why detail and not scroll-to-row: creation is optimistic and Home is a
 * visible, variable-height virtualized list that can run to hundreds of
 * rows. The library's scroll-and-highlight only works because it converges
 * hidden behind a modal; done in view it is a blank frame plus a ladder of
 * jumps, and an animated scroll to an unmeasured far row lands short. The
 * detail modal is deterministic and its entrance is the redirect animation.
 *
 * The action stays disabled ("Adding…") until the server habit exists: the
 * optimistic row's temp id is not a valid document id for habits.get.
 */

import { useCallback, useMemo } from 'react';
import { TemplateAddedToast } from '../../../components/TemplateAddedToast';
import { useHaptics } from '../../../utils/haptics/useHaptics';
import { isOptimisticHabitId } from '../hooks/optimisticHabitCreationStore';
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
    habits,
    openCreateHabitScreen,
    openHabitDetail,
  } = modals;
  const habitId = createdHabitFeedback?.habitId ?? null;

  const habit = useMemo(() => {
    if (!habitId || isOptimisticHabitId(habitId)) return null;
    return habits.find((item) => item._id === habitId) ?? null;
  }, [habitId, habits]);

  // Mirrors the library's handleViewHabit: tap haptic, then the detail
  // screen. The toast's own exit runs alongside and clears the feedback via
  // onDismiss.
  const handleGoToHabit = useCallback(() => {
    if (!habit) return;
    trigger('tap');
    openHabitDetail(habit);
  }, [habit, openHabitDetail, trigger]);

  const handleAddAnother = useCallback(() => {
    trigger('tap');
    openCreateHabitScreen();
  }, [openCreateHabitScreen, trigger]);

  return (
    <TemplateAddedToast
      actionReady={habit != null}
      primaryHint='Opens this habit'
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
