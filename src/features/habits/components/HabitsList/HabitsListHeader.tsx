/**
 * HabitsListHeader - Redesigned per home-screen-redesign-spec.md
 */

/* eslint-disable max-lines-per-function */

import { Animated, View } from 'react-native';
import { HabitsHeader } from '../HabitsHeader';
import { CalendarTimeline } from '../../../../components/CalendarTimeline';
import { HabitStatsWidget } from '../../../../components/HabitStatsWidget';
import { OfflineIndicator } from '../../../../components/SyncStatus';
import {
  TrialCountdownBanner,
  useTrialCountdown,
} from '../../../../components/TrialCountdownBanner';
import type { HabitsListHeaderProps } from './HabitsListHeader.types';
import { useHabitsListHeaderComputed } from './useHabitsListHeaderComputed';

export function HabitsListHeader(
  props: HabitsListHeaderProps
): React.ReactElement {
  const computed = useHabitsListHeaderComputed({
    getHabitStatus: props.getHabitStatus,
    habits: props.habits,
    justCreatedHabitId: props.justCreatedHabitId,
    weekDateStrings: props.weekDateStrings,
  });

  // Trial countdown banner
  const { shouldShowBanner, daysRemaining } = useTrialCountdown();

  return (
    <View className='gap-4 pb-4 pt-14'>
      <View className='absolute left-0 right-0 top-4 z-10 flex-row justify-center'>
        <OfflineIndicator
          testID='habits-offline-indicator'
          visible={computed.isOffline}
        />
      </View>
      
      {/* Habit Stats Widget */}
      {computed.totalHabits > 0 && (
        <HabitStatsWidget
          completedToday={computed.completedToday}
          getHabitStatus={props.getHabitStatus}
          getStreak={props.getStreak}
          habits={props.habits}
          reduceMotion={props.reduceMotionPreference}
          totalHabits={computed.totalHabits}
          weekDateStrings={props.weekDateStrings}
        />
      )}
      
      <Animated.View
        style={{
          opacity: props.headerOpacity,
          transform: [{ translateY: props.headerTranslateY }],
        }}
      >
        <HabitsHeader
          completedToday={computed.completedToday}
          forceShow={props.justCreatedHabitId !== null}
          openCreateHabitScreen={props.onAddHabitPress}
          openSettings={props.openSettings}
          openSortSheet={props.onOpenSortSheet}
          openTemplatesScreen={props.openTemplatesScreen}
          showCompletionSummary={props.showWeekCompletionBar}
          totalHabits={computed.totalHabits}
        />
      </Animated.View>
      {computed.shouldShowTimeline && (
        <Animated.View
          style={{
            opacity: props.calendarOpacity,
            transform: [{ translateY: props.calendarTranslateY }],
          }}
        >
          <CalendarTimeline
            disableFutureDayPress
            showSeparator
            canNavigateForward={props.canNavigateForward}
            completionByDay={computed.completionByDay}
            dates={props.weekDates}
            reduceMotion={props.reduceMotionPreference}
            onDayPress={props.onDayPress}
            onNextWeek={props.onNextWeek}
            onPreviousWeek={props.onPreviousWeek}
          />
        </Animated.View>
      )}

      {/* Trial Countdown Banner */}
      {shouldShowBanner && daysRemaining !== null && (
        <TrialCountdownBanner
          daysRemaining={daysRemaining}
          onUpgrade={props.onUpgradePress}
        />
      )}
    </View>
  );
}
