/**
 * renderHabitsListEmpty — FlatList `ListEmptyComponent` factory.
 *
 * Returns a `HabitsEmptyStateMinimal` element shown when the user has no
 * habits yet.  Provides quick-create and template entry points plus a
 * success-transition callback that kicks off the list entrance animation
 * after the first habit is created from the empty state.
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
