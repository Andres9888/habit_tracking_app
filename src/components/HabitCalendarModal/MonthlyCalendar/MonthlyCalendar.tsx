/**
 * MonthlyCalendar Component
 * Matches Figma design: Monthly calendar grid with blue dots for completed days
 * and black circle around current day
 */

import { View } from 'react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  startOfToday,
} from 'date-fns';
import { useMemo, useState } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { MonthNavigator } from './MonthNavigator';
import { DayNamesRow } from './DayNamesRow';
import { DayCell } from './DayCell';

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

  const completedDates = useMemo(() => {
    const set = new Set<string>();
    for (const t of tracking) {
      if (t.habitId === habitId && t.completed) set.add(t.date);
    }
    return set;
  }, [habitId, tracking]);

  const isCompleted = (date: Date) => completedDates.has(format(date, 'yyyy-MM-dd'));

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <View>
      <MonthNavigator
        currentDate={currentDate}
        onNextMonth={goToNextMonth}
        onPreviousMonth={goToPreviousMonth}
      />
      <DayNamesRow />
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
    </View>
  );
}
