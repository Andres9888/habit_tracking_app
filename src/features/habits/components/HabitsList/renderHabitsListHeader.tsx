/**
 * renderHabitsListHeader — FlatList `ListHeaderComponent` factory.
 *
 * Builds a {@link HabitsListHeader} element that contains the date title,
 * calendar timeline, offline indicator, and trial countdown banner.
 *
 * Action buttons have moved to BottomActionBar.
 */

import { View } from 'react-native';
import { HabitsListHeader } from './HabitsListHeader';
import { SelectAllRow } from '../SelectAllRow';
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
  const handleToggleSelectAll = () => {
    if (props.isAllSelected) props.onDeselectAll?.();
    else props.onSelectAll?.();
  };

  return (
    <View style={{ elevation: 20, zIndex: 20 }}>
      <HabitsListHeader
        averageStrengthPercent={list.averageStrengthPercent}
        calendarOpacity={state.calendarOpacity}
        calendarTranslateY={state.calendarTranslateY}
        canNavigateForward={canNavigateForward}
        compactView={list.compactView}
        completedToday={list.completedToday}
        completionByDay={list.completionByDay}
        completionIcon={list.habitCompletionIcon}
        currentStreak={list.currentStreak}
        headerOpacity={state.headerOpacity}
        headerTranslateY={state.headerTranslateY}
        justCreatedHabitId={state.justCreatedHabitId}
        reduceMotionPreference={list.reduceMotionPreference}
        totalHabits={list.habits.length}
        weekDates={weekDates}
        weekDateStrings={list.weekDateStrings}
        onDayPress={state.handleDayPress}
        onJumpToToday={onJumpToToday}
        onNextWeek={onNextWeek}
        onPreviousWeek={onPreviousWeek}
        onUpgradePress={onUpgradeIntent}
      />
      {props.isSelectionMode ? (
        <SelectAllRow
          isAllSelected={props.isAllSelected ?? false}
          selectedCount={props.selectedCount ?? 0}
          totalCount={list.habits.length}
          onToggleSelectAll={handleToggleSelectAll}
        />
      ) : null}
    </View>
  );
}
