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

interface HabitsListHeaderProps {
  habits: Array<{ _id: string }>;
  weekDateStrings: string[];
  weekDates: Date[];
  canNavigateForward: boolean;
  justCreatedHabitId: string | null;
  reduceMotionPreference: boolean;
  showWeekCompletionBar: boolean;
  headerOpacity: Animated.Value;
  headerTranslateY: Animated.Value;
  calendarOpacity: Animated.Value;
  calendarTranslateY: Animated.Value;
  getHabitStatus: (habitId: string, dateString: string) => string;
  onAddHabitPress: () => void;
  onDayPress: (date: Date) => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onOpenSortSheet: () => void;
  openSettings: () => void;
  openTemplatesScreen: () => void;
}

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
    onAddHabitPress,
    onDayPress,
    onNextWeek,
    onPreviousWeek,
    onOpenSortSheet,
    openSettings,
    openTemplatesScreen,
  } = props;

  const todayString = new Date().toISOString().split('T')[0];
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
          openCreateHabitScreen={onAddHabitPress}
          openSettings={openSettings}
          openSortSheet={onOpenSortSheet}
          openTemplatesScreen={openTemplatesScreen}
          reduceMotion={reduceMotionPreference}
          showCompletionSummary={showWeekCompletionBar}
          totalHabits={totalHabits}
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
