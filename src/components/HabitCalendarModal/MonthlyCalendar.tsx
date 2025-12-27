/**
 * MonthlyCalendar Component
 * Matches Figma design: Monthly calendar grid with blue dots for completed days
 * and black circle around current day
 */

import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
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
import type { Id } from '../../../convex/_generated/dataModel';

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

  // Get all days in the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ end: monthEnd, start: monthStart });

  // Calculate empty cells before first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  // Check if a date is completed
  const isCompleted = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return tracking.some(
      (t) => t.habitId === habitId && t.date === dateString && t.completed
    );
  };

  // Navigation handlers
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
      {/* Header with Month/Year and Navigation */}
      <View className='mb-4 flex-row items-center justify-between'>
        <Text className='text-lg font-bold text-stone-900'>
          {format(currentDate, 'MMMM yyyy')}
        </Text>

        <View className='flex-row gap-2'>
          <Pressable
            className='h-8 w-8 items-center justify-center rounded-full active:bg-stone-100'
            onPress={goToPreviousMonth}
          >
            <ChevronLeft color='#1c1917' size={20} />
          </Pressable>

          <Pressable
            className='h-8 w-8 items-center justify-center rounded-full active:bg-stone-100'
            onPress={goToNextMonth}
          >
            <ChevronRight color='#1c1917' size={20} />
          </Pressable>
        </View>
      </View>

      {/* Day Names Row */}
      <View className='mb-3 flex-row'>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <View key={day} className='w-[14.28%] items-center'>
            <Text className='text-sm font-medium text-stone-500'>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View className='flex-row flex-wrap'>
        {/* Empty cells before first day */}
        {emptyDays.map((i) => (
          <View key={`empty-${i}`} className='mb-2 h-7 w-[14.28%]' />
        ))}

        {/* Actual days */}
        {daysInMonth.map((date) => {
          const isToday = isSameDay(date, today);
          const hasCompletion = isCompleted(date);
          const dateString = format(date, 'yyyy-MM-dd');

          return (
            <Pressable
              key={dateString}
              className='mb-2 w-[14.28%] items-center'
              onPress={() => toggleHabit({ date: dateString, habitId })}
            >
              <View className='relative items-center'>
                {/* Day number with optional black circle for today */}
                {isToday ? (
                  <View className='h-8 w-8 items-center justify-center rounded-full bg-stone-900'>
                    <Text className='text-base font-bold text-white'>
                      {format(date, 'd')}
                    </Text>
                  </View>
                ) : (
                  <View className='h-7 items-center justify-center'>
                    <Text className='text-base font-semibold text-stone-900'>
                      {format(date, 'd')}
                    </Text>
                  </View>
                )}

                {/* Blue dot for completed days */}
                {hasCompletion && (
                  <View className='absolute -bottom-1 h-1 w-1 rounded-full bg-blue-500' />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
