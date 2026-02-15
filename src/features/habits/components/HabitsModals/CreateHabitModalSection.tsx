
import type { CreateHabitModalSectionProps } from './HabitsModals.types';
import CreateHabitModal from '../../../../components/CreateHabitModal';

/**
 * Create habit modal section - handles habit creation/editing
 */
export function CreateHabitModalSection({
  showCreateHabit,
  habitToEdit,
  closeCreateHabit,
}: CreateHabitModalSectionProps) {
  return (
    <CreateHabitModal
      habitToEdit={habitToEdit || undefined}
      visible={showCreateHabit}
      onClose={closeCreateHabit}
    />
  );
}
