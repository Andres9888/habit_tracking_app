/**
 * HabitsListContent - The draggable list of habits
 */

import { Animated, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { HabitsEmptyStateMinimal } from '../HabitsEmptyStateMinimal';
import { HabitsListHeader } from './HabitsListHeader';
import { HabitsListFooter } from './HabitsListFooter';
import { HabitsListModals } from './HabitsListModals';
import type { HabitsListProps } from './HabitsList.types';

export interface HabitsListContentProps {
  props: HabitsListProps;
  state: ReturnType<typeof import('./useHabitsListState').useHabitsListState>;
  handlers: ReturnType<
    typeof import('./useHabitsListHandlers').useHabitsListHandlers
  >;
  renderItem: ReturnType<
    typeof import('../../hooks/useHabitRenderItem').useHabitRenderItem
  >;
  handleSuccessTransitionComplete: () => void;
}

export function HabitsListContent({
  props,
  state,
  handlers,
  renderItem,
  handleSuccessTransitionComplete,
}: HabitsListContentProps) {
  const {
    list,
    modals,
    weekDates,
    canNavigateForward,
    onNextWeek,
    onPreviousWeek,
  } = props;
  const {
    upgradePromptVisible,
    onUpgradeDismiss,
    onUpgradeConfirm,
    onUpgradeIntent,
  } = props;
  const { habits, isHabitsLoading, contentPadding, handleDragEnd } = list;
  const {
    weekDateStrings,
    getHabitStatus,
    reduceMotionPreference,
    showWeekCompletionBar,
  } = list;
  const { hasReachedHabitLimit, isPremiumUser } = list;

  return (
    <View className='flex-1 bg-transparent'>
      <DraggableFlatList
        activationDistance={handlers.isReorderingEnabled ? 12 : 9999}
        contentContainerStyle={{
          paddingBottom: contentPadding.paddingBottom,
          paddingHorizontal: contentPadding.paddingHorizontal,
          paddingTop: 0,
        }}
        data={habits}
        keyExtractor={handlers.keyExtractor}
        ListEmptyComponent={
          <HabitsEmptyStateMinimal
            isLoading={isHabitsLoading}
            openCreateHabitScreen={handlers.handleAddHabitPress}
            openTemplatesScreen={modals.openTemplatesScreen}
            onQuickCreateHabit={handlers.handleQuickCreateHabit}
            onSuccessTransitionComplete={handleSuccessTransitionComplete}
          />
        }
        ListFooterComponent={
          <HabitsListFooter
            hasReachedHabitLimit={hasReachedHabitLimit}
            isPremiumUser={isPremiumUser}
            reduceMotionPreference={reduceMotionPreference}
            onUpgradeIntent={onUpgradeIntent}
          />
        }
        ListHeaderComponent={
          <HabitsListHeader
            calendarOpacity={state.calendarOpacity}
            calendarTranslateY={state.calendarTranslateY}
            canNavigateForward={canNavigateForward}
            getHabitStatus={getHabitStatus}
            habits={habits}
            headerOpacity={state.headerOpacity}
            headerTranslateY={state.headerTranslateY}
            justCreatedHabitId={state.justCreatedHabitId}
            openSettings={modals.openSettings}
            openTemplatesScreen={modals.openTemplatesScreen}
            reduceMotionPreference={reduceMotionPreference}
            showWeekCompletionBar={showWeekCompletionBar}
            weekDates={weekDates}
            weekDateStrings={weekDateStrings}
            onAddHabitPress={handlers.handleAddHabitPress}
            onDayPress={state.handleDayPress}
            onNextWeek={onNextWeek}
            onOpenSortSheet={state.handleOpenSortSheet}
            onPreviousWeek={onPreviousWeek}
          />
        }
        renderItem={(p) => (
          <Animated.View
            style={
              p.item._id === state.justCreatedHabitId
                ? {
                    opacity: state.habitRowOpacity,
                    transform: [{ translateY: state.habitRowTranslateY }],
                  }
                : undefined
            }
          >
            {renderItem(p)}
          </Animated.View>
        )}
        showsVerticalScrollIndicator={false}
        onDragBegin={handlers.handleDragBegin}
        onDragEnd={handleDragEnd}
      />
      <HabitsListModals
        handlers={handlers}
        list={list}
        state={state}
        upgradePromptVisible={upgradePromptVisible}
        onUpgradeConfirm={onUpgradeConfirm}
        onUpgradeDismiss={onUpgradeDismiss}
      />
    </View>
  );
}
