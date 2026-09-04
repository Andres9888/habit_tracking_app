import { useCallback, useEffect, useState } from 'react';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import CreateHabitModal from '../../../../components/CreateHabitModal';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { EXIT_DURATIONS } from '../../../../components/Modal/Modal.constants';
import type { CreateHabitModalSectionProps } from './HabitsModals.types';

/**
 * Time for the dismissed RNModal to leave the native stack after the JS exit
 * timer flips it invisible. (RNModal's onDismiss never fires on this build, so
 * this is a margin, not a signal.) In practice the gate is moot: the server
 * habit the opener also waits for takes ~2s to reach habits.list.
 */
const NATIVE_MODAL_HANDOFF_MS = 800;

/**
 * Create habit modal section - handles habit creation/editing
 */
export function CreateHabitModalSection({
  showCreateHabit,
  habitToEdit,
  closeCreateHabit,
  onHabitCreated,
  onHabitCreateSynced,
}: CreateHabitModalSectionProps) {
  const [shouldRender, setShouldRender] = useState(showCreateHabit);
  const [renderedHabitToEdit, setRenderedHabitToEdit] = useState(habitToEdit);

  // The detail screen must not open before this form's native modal is gone:
  // iOS drops a presentation attempted while another modal is still
  // dismissing.
  const handleHabitCreated = useCallback(
    (tempId: Id<'habits'>) =>
      onHabitCreated?.(
        tempId,
        Date.now() + EXIT_DURATIONS.fullScreen + NATIVE_MODAL_HANDOFF_MS
      ),
    [onHabitCreated]
  );

  useEffect(() => {
    if (showCreateHabit) {
      setRenderedHabitToEdit(habitToEdit);
      setShouldRender(true);
      return;
    }

    const timeout = setTimeout(() => {
      setShouldRender(false);
      setRenderedHabitToEdit(null);
    }, EXIT_DURATIONS.fullScreen);

    return () => clearTimeout(timeout);
  }, [habitToEdit, showCreateHabit]);

  if (!shouldRender) {
    return null;
  }

  return (
    <ErrorBoundary fallback={null}>
      <CreateHabitModal
        habitToEdit={renderedHabitToEdit || undefined}
        visible={showCreateHabit}
        onClose={closeCreateHabit}
        onHabitCreateSynced={onHabitCreateSynced}
        onHabitCreated={handleHabitCreated}
      />
    </ErrorBoundary>
  );
}
