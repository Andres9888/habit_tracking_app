/**
 * renderHabitsListHeader — FlatList `ListHeaderComponent` factory.
 *
 * Builds a {@link HabitsListHeader} element that contains the summary stats,
 * calendar timeline, offline indicator, and trial countdown banner.  Props are
 * plucked from the full `HabitsListProps`, local UI state, and handler bag.
 */

import { HabitsListHeader } from './HabitsListHeader';
import type { HabitsListProps } from './HabitsList.types';

interface RenderHabitsListHeaderOptions {
  props: HabitsListProps;
  state: ReturnType<typeof import('./useHabitsListState').useHabitsListState>;
  handlers: ReturnType<
    typeof import('./useHabitsListHandlers').useHabitsListHandlers
  >;
}

export function renderHabitsListHeader({
  props,
  state,
  handlers,
}: RenderHabitsListHeaderOptions) {
  const {
    list,
    modals,
    weekDates,
    canNavigateForward,
    onNextWeek,
    onPreviousWeek,
    onUpgradeIntent,
  } = props;
  return (
    <HabitsListHeader
      calendarOpacity={state.calendarOpacity}
      calendarTranslateY={state.calendarTranslateY}
      canNavigateForward={canNavigateForward}
      getHabitStatus={list.getHabitStatus}
      habits={list.habits}
      headerOpacity={state.headerOpacity}
      headerTranslateY={state.headerTranslateY}
      isPremiumUser={list.isPremiumUser}
      justCreatedHabitId={state.justCreatedHabitId}
      openSettings={modals.openSettings}
      openTemplatesScreen={modals.openTemplatesScreen}
      reduceMotionPreference={list.reduceMotionPreference}
      showWeekCompletionBar={list.showWeekCompletionBar}
      weekDates={weekDates}
      weekDateStrings={list.weekDateStrings}
      onAddHabitPress={handlers.handleAddHabitPress}
      onDayPress={state.handleDayPress}
      onNextWeek={onNextWeek}
      onOpenSortSheet={state.handleOpenSortSheet}
      onPreviousWeek={onPreviousWeek}
      onUpgradePress={onUpgradeIntent}
    />
  );
}
