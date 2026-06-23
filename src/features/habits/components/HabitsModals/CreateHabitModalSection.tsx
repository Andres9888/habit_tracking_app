import { useEffect, useState } from 'react';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import CreateHabitModal from '../../../../components/CreateHabitModal';
import { EXIT_DURATIONS } from '../../../../components/Modal/Modal.constants';
import type { CreateHabitModalSectionProps } from './HabitsModals.types';

/**
 * Create habit modal section - handles habit creation/editing
 */
export function CreateHabitModalSection({
  showCreateHabit,
  habitToEdit,
  closeCreateHabit,
  initialName,
}: CreateHabitModalSectionProps) {
  const [shouldRender, setShouldRender] = useState(showCreateHabit);
  const [renderedHabitToEdit, setRenderedHabitToEdit] = useState(habitToEdit);
  // Snapshot the seed name at open time so it survives the exit animation
  // (the parent clears it once the modal starts closing).
  const [renderedInitialName, setRenderedInitialName] = useState(initialName);

  useEffect(() => {
    if (showCreateHabit) {
      setRenderedHabitToEdit(habitToEdit);
      setRenderedInitialName(initialName);
      setShouldRender(true);
      return;
    }

    const timeout = setTimeout(() => {
      setShouldRender(false);
      setRenderedHabitToEdit(null);
      setRenderedInitialName(null);
    }, EXIT_DURATIONS.fullScreen);

    return () => clearTimeout(timeout);
  }, [habitToEdit, initialName, showCreateHabit]);

  if (!shouldRender) {
    return null;
  }

  return (
    <ErrorBoundary fallback={null}>
      <CreateHabitModal
        habitToEdit={renderedHabitToEdit || undefined}
        initialName={renderedInitialName || undefined}
        visible={showCreateHabit}
        onClose={closeCreateHabit}
      />
    </ErrorBoundary>
  );
}
