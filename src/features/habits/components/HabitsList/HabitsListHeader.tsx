import { getTodayString } from '../../../../../utils/getLocalDateString';
/**
 * HabitsListHeader Component
 * Renders the header section with HabitsHeader and CalendarTimeline
 */

import { Animated, View } from 'react-native';
import { HabitsHeader } from '../HabitsHeader';
import {
  CalendarTimeline,
  type DayCompletionStatus,
} from '../../../../components/CalendarTimeline';
import type { HabitsListHeaderProps } from './HabitsListHeader.types';

export function HabitsListHeader(props: HabitsListHeaderProps) {
  const {
    habits,
    weekDateStrings,
    weekDates,
    canNavigateForward,
    justCreatedHabitId,
    reduceMotionPreference,
    showWeekCompletionBar,
  } = props;
  const {
    headerOpacity,
    headerTranslateY,
    calendarOpacity,
    calendarTranslateY,
    getHabitStatus,
  } = props;
  const {
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

  const todayString = getTodayString();
  const completedToday = habits.filter(
    (h) => getHabitStatus(h._id, todayString) === 'done'
  ).length;
  const totalHabits = habits.length;

  const completionByDay: Record<string, DayCompletionStatus> = {};
  for (const dateString of weekDateStrings) {
    completionByDay[dateString] = {
      completed: habits.filter(
        (h) => getHabitStatus(h._id, dateString) === 'done'
      ).length,
      total: totalHabits,
    };
  }

  const shouldShowTimeline = totalHabits > 0 || justCreatedHabitId !== null;

  return (
    <View className='gap-3 pb-2.5 pt-16'>
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
