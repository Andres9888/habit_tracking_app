import { useCallback, useEffect, useState } from 'react';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import CreateHabitModal from '../../../../components/CreateHabitModal';
import type { CreatedHabitInfo } from '../../../../components/CreateHabitModal/types';
import { EXIT_DURATIONS } from '../../../../components/Modal/Modal.constants';
import type { CreateHabitModalSectionProps } from './HabitsModals.types';

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

  // Let the form finish its exit first so the toast slides up onto Home
  // instead of appearing over a modal that is still closing.
  const handleHabitCreated = useCallback(
    (habit: CreatedHabitInfo) =>
      onHabitCreated?.(habit, EXIT_DURATIONS.fullScreen),
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
