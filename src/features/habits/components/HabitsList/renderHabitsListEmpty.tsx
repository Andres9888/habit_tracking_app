/**
 * renderHabitsListEmpty - Empty state renderer for HabitsList
 */

import { HabitsEmptyStateMinimal } from '../HabitsEmptyStateMinimal';
import type { HabitsListProps } from './HabitsList.types';

interface RenderHabitsListEmptyOptions {
  list: HabitsListProps['list'];
  modals: HabitsListProps['modals'];
  handlers: ReturnType<
    typeof import('./useHabitsListHandlers').useHabitsListHandlers
  >;
  onTransitionComplete: () => void;
}

export function renderHabitsListEmpty(opts: RenderHabitsListEmptyOptions) {
  const { list, modals, handlers, onTransitionComplete } = opts;
  return (
    <HabitsEmptyStateMinimal
      isLoading={list.isHabitsLoading}
      openCreateHabitScreen={handlers.handleAddHabitPress}
      openTemplatesScreen={modals.openTemplatesScreen}
      onQuickCreateHabit={handlers.handleQuickCreateHabit}
      onSuccessTransitionComplete={onTransitionComplete}
    />
  );
}
