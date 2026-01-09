/**
 * HabitsListRenders - List component renderers
 */

import { Animated } from 'react-native';
import { HabitsEmptyStateMinimal } from '../HabitsEmptyStateMinimal';
import { HabitsListHeader } from './HabitsListHeader';
import { HabitsListFooter } from './HabitsListFooter';
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
    />
  );
}

interface RenderHabitsListFooterOptions {
  list: HabitsListProps['list'];
  onUpgradeIntent: HabitsListProps['onUpgradeIntent'];
}

export function renderHabitsListFooter({
  list,
  onUpgradeIntent,
}: RenderHabitsListFooterOptions) {
  return (
    <HabitsListFooter
      hasReachedHabitLimit={list.hasReachedHabitLimit}
      isPremiumUser={list.isPremiumUser}
      reduceMotionPreference={list.reduceMotionPreference}
      onUpgradeIntent={onUpgradeIntent}
    />
  );
}

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

interface RenderHabitRowOptions {
  item: { _id?: string };
  justCreatedHabitId: string | null;
  habitRowOpacity: Animated.Value;
  habitRowTranslateY: Animated.Value;
  renderItem: (p: unknown) => React.ReactNode;
  renderParams: unknown;
}

export function renderHabitRow(opts: RenderHabitRowOptions) {
  const {
    item,
    justCreatedHabitId,
    habitRowOpacity,
    habitRowTranslateY,
    renderItem,
    renderParams,
  } = opts;
  return (
    <Animated.View
      style={
        item._id === justCreatedHabitId
          ? {
              opacity: habitRowOpacity,
              transform: [{ translateY: habitRowTranslateY }],
            }
          : undefined
      }
    >
      {renderItem(renderParams)}
    </Animated.View>
  );
}
