import CreateHabitModal, {
  CreateHabitModalCentered,
} from '../../../../components/CreateHabitModal';
import type { CreateHabitModalSectionProps } from './HabitsModals.types';

/**
 * Feature flag: Toggle between original and centered habit creation modal
 *
 * Original modal:  All fields visible upfront with equal visual weight
 * Centered modal:  Progressive disclosure - name required, customization optional
 *
 * To enable centered layout: Set to `true`
 * To use original layout:   Set to `false` (default)
 */
const USE_CENTERED_HABIT_MODAL = true;

/**
 * Create habit modal section - handles habit creation/editing
 */
export function CreateHabitModalSection({
  showCreateHabit,
  habitToEdit,
  closeCreateHabit,
}: CreateHabitModalSectionProps) {
  if (USE_CENTERED_HABIT_MODAL) {
    return (
      <CreateHabitModalCentered
        habitToEdit={habitToEdit || undefined}
        visible={showCreateHabit}
        onClose={closeCreateHabit}
      />
    );
  }

  return (
    <CreateHabitModal
      habitToEdit={habitToEdit || undefined}
      visible={showCreateHabit}
      onClose={closeCreateHabit}
    />
  );
}
