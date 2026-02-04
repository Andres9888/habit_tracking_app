import { SingleScreenCreateHabitModal } from '../../../../components/CreateHabitModal';
import type { CreateHabitModalSectionProps } from './HabitsModals.types';

/**
 * Create habit modal section - handles habit creation/editing
 *
 * Uses the redesigned single-screen modal with:
 * - Smart defaults (random icon, sage green #6B8F71, no reminder, Anytime phase)
 * - Collapsible customize panel for optional customization
 * - Auto-focused name field on open
 * - Single-screen flow for minimal cognitive load
 * - Based on habit-creation-redesign-spec.md
 */
export function CreateHabitModalSection({
  showCreateHabit,
  habitToEdit,
  closeCreateHabit,
}: CreateHabitModalSectionProps) {
  return (
    <SingleScreenCreateHabitModal
      habitToEdit={habitToEdit || undefined}
      visible={showCreateHabit}
      onClose={closeCreateHabit}
    />
  );
}
