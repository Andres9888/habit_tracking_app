import ErrorBoundary from '../../../../components/ErrorBoundary';
import CreateHabitModal from '../../../../components/CreateHabitModal';
import type { CreateHabitModalSectionProps } from './HabitsModals.types';

/**
 * Create habit modal section - handles habit creation/editing
 */
export function CreateHabitModalSection({
  showCreateHabit,
  habitToEdit,
  closeCreateHabit,
}: CreateHabitModalSectionProps) {
  if (!showCreateHabit) {
    return null;
  }

  return (
    <ErrorBoundary fallback={null}>
      <CreateHabitModal
        habitToEdit={habitToEdit || undefined}
        visible={showCreateHabit}
        onClose={closeCreateHabit}
      />
    </ErrorBoundary>
  );
}
