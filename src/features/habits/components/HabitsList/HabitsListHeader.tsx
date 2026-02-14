/**
 * HabitsListHeader - Redesigned per home-screen-redesign-spec.md
 *
 * Uses react-native-reanimated for spring-physics entrance animations.
 */

/* eslint-disable max-lines-per-function */

import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { HabitsHeader } from '../HabitsHeader';
import { CalendarTimeline } from '../../../../components/CalendarTimeline';
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

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: props.headerOpacity.value,
    transform: [{ translateY: props.headerTranslateY.value }],
  }));

  const calendarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: props.calendarOpacity.value,
    transform: [{ translateY: props.calendarTranslateY.value }],
  }));

  return (
    <View className='gap-4 pb-4 pt-14'>
      <View className='absolute left-0 right-0 top-4 z-10 flex-row justify-center'>
        <OfflineIndicator
          testID='habits-offline-indicator'
          visible={computed.isOffline}
        />
      </View>
      <Animated.View style={headerAnimatedStyle}>
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
        <Animated.View style={calendarAnimatedStyle}>
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
