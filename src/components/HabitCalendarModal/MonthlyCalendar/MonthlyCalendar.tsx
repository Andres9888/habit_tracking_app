/**
 * MonthlyCalendar Component
 * Matches Figma design: Monthly calendar grid with blue dots for completed days
 * and black circle around current day
 */

import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  startOfToday,
} from 'date-fns';
import { useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';
import { MonthNavigator } from './MonthNavigator';
import { DayNamesRow } from './DayNamesRow';
import { DayCell } from './DayCell';

const SWIPE_THRESHOLD = 50;

interface MonthlyCalendarProps {
  habitId: Id<'habits'>;
  tracking: Array<{ habitId: Id<'habits'>; date: string; completed: boolean }>;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
}

export function MonthlyCalendar({
  habitId,
  tracking,
  toggleHabit,
}: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = startOfToday();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ end: monthEnd, start: monthStart });
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const isCompleted = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return tracking.some(
      (t) => t.habitId === habitId && t.date === dateString && t.completed
    );
  };

  const goToPreviousMonth = () => {
    void triggerHaptic('selection');
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    void triggerHaptic('selection');
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-20, 20])
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) scheduleOnRN(goToNextMonth);
      else if (event.translationX > SWIPE_THRESHOLD) scheduleOnRN(goToPreviousMonth);
    });

  return (
    <View>
      <MonthNavigator
        currentDate={currentDate}
        onNextMonth={goToNextMonth}
        onPreviousMonth={goToPreviousMonth}
      />
      <DayNamesRow />
      <GestureDetector gesture={swipeGesture}>
        <View className='flex-row flex-wrap'>
          {emptyDays.map((i) => (
            <View key={`empty-${i}`} className='mb-2 h-7 w-[14.28%]' />
          ))}
          {daysInMonth.map((date) => (
            <DayCell
              key={format(date, 'yyyy-MM-dd')}
              date={date}
              hasCompletion={isCompleted(date)}
              isToday={isSameDay(date, today)}
              onToggle={() =>
                toggleHabit({ date: format(date, 'yyyy-MM-dd'), habitId })
              }
            />
          ))}
        </View>
      </GestureDetector>
    </View>
  );
}
