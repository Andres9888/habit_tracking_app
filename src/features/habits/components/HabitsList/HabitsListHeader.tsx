/**
 * HabitsListHeader Component
 * Renders the header section with HabitsHeader and CalendarTimeline
 *
 * Implements US3 (Visual Sync Status Indicators) - displays OfflineIndicator
 * when app is offline per acceptance criteria 1.
 */

import { Animated, View } from 'react-native';
import { HabitsHeader } from '../HabitsHeader';
import { CalendarTimeline } from '../../../../components/CalendarTimeline';
import { OfflineIndicator } from '../../../../components/SyncStatus';
import type { HabitsListHeaderProps } from './HabitsListHeader.types';
import { useHabitsListHeaderComputed } from './useHabitsListHeaderComputed';

export function HabitsListHeader(props: HabitsListHeaderProps) {
  const {
    habits,
    weekDateStrings,
    weekDates,
    canNavigateForward,
    justCreatedHabitId,
    reduceMotionPreference,
    showWeekCompletionBar,
    headerOpacity,
    headerTranslateY,
    calendarOpacity,
    calendarTranslateY,
    getHabitStatus,
    isPremiumUser,
    onAddHabitPress,
    onDayPress,
    onNextWeek,
    onPreviousWeek,
    onOpenSortSheet,
    onUpgradePress,
    openSettings,
    openTemplatesScreen,
  } = props;

  const {
    completedToday,
    totalHabits,
    completionByDay,
    shouldShowTimeline,
    isOffline,
  } = useHabitsListHeaderComputed({
    getHabitStatus,
    habits,
    justCreatedHabitId,
    weekDateStrings,
  });

  return (
    <View className='gap-3 pb-2.5 pt-16'>
      {/* US3: Subtle offline indicator - positioned at top center */}
      <View className='absolute left-0 right-0 top-4 z-10 flex-row justify-center'>
        <OfflineIndicator
          testID='habits-offline-indicator'
          visible={isOffline}
        />
      </View>
      <Animated.View
        style={{
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }],
        }}
      >
        <HabitsHeader
          completedToday={completedToday}
          forceShow={justCreatedHabitId !== null}
          isPremiumUser={isPremiumUser}
          openCreateHabitScreen={onAddHabitPress}
          openSettings={openSettings}
          openSortSheet={onOpenSortSheet}
          openTemplatesScreen={openTemplatesScreen}
          reduceMotion={reduceMotionPreference}
          showCompletionSummary={showWeekCompletionBar}
          totalHabits={totalHabits}
          onUpgradePress={onUpgradePress}
        />
      </Animated.View>
      {shouldShowTimeline && (
        <Animated.View
          style={{
            opacity: calendarOpacity,
            transform: [{ translateY: calendarTranslateY }],
          }}
        >
          <CalendarTimeline
            disableFutureDayPress
            showSeparator
            canNavigateForward={canNavigateForward}
            completionByDay={completionByDay}
            dates={weekDates}
            reduceMotion={reduceMotionPreference}
            onDayPress={onDayPress}
            onNextWeek={onNextWeek}
            onPreviousWeek={onPreviousWeek}
          />
        </Animated.View>
      )}
    </View>
  );
}
