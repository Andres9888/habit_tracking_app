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
}: CreateHabitModalSectionProps) {
  const [shouldRender, setShouldRender] = useState(showCreateHabit);
  const [renderedHabitToEdit, setRenderedHabitToEdit] = useState(habitToEdit);

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
      />
    </ErrorBoundary>
  );
}
