import ErrorBoundary from '../../../../components/ErrorBoundary';
import { CreateHabitModalSection } from './CreateHabitModalSection';
import { PrimaryModalSections } from './PrimaryModalSections';
import { QuickActionsSection } from './QuickActionsSection';
import { SecondaryModalSections } from './SecondaryModalSections';
import type { HabitsModalsProps } from './HabitsModals.types';
import { getQuickActionsProps } from './HabitsModals.helpers';
import { useRetainedModalMount } from './useRetainedModalMount';

export function HabitsModals({ state }: HabitsModalsProps) {
  const shouldMountQuickActions = useRetainedModalMount(state.showQuickActions);

  return (
    <>
      <PrimaryModalSections state={state} />
      <ErrorBoundary fallback={null}>
        <CreateHabitModalSection
          closeCreateHabit={state.closeCreateHabit}
          habitToEdit={state.habitToEdit}
          showCreateHabit={state.showCreateHabit}
        />
      </ErrorBoundary>
      <SecondaryModalSections state={state} />
      {shouldMountQuickActions ? (
        <QuickActionsSection {...getQuickActionsProps(state)} />
      ) : null}
    </>
  );
}
export default HabitsModals;
