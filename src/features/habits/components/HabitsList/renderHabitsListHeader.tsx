/**
 * renderHabitsListHeader — FlatList `ListHeaderComponent` factory.
 *
 * Builds a {@link HabitsListHeader} element that contains the date title,
 * calendar timeline, offline indicator, and trial countdown banner.
 *
 * Action buttons have moved to BottomActionBar.
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
}: RenderHabitsListHeaderOptions) {
  const {
    list,
    weekDates,
    canNavigateForward,
    onJumpToToday,
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
      getStreak={list.getStreak}
      habits={list.habits}
      headerOpacity={state.headerOpacity}
      headerTranslateY={state.headerTranslateY}
      justCreatedHabitId={state.justCreatedHabitId}
      reduceMotionPreference={list.reduceMotionPreference}
      weekDates={weekDates}
      weekDateStrings={list.weekDateStrings}
      onDayPress={state.handleDayPress}
      onJumpToToday={onJumpToToday}
      onNextWeek={onNextWeek}
      onPreviousWeek={onPreviousWeek}
      onUpgradePress={onUpgradeIntent}
    />
  );
}
