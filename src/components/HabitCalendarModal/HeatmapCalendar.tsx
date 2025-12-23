import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from 'date-fns';
import { View, Text } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';

interface HeatmapCalendarProps {
  habitId: Id<'habits'>;
  tracking: Array<{ habitId: Id<'habits'>; date: string; completed: boolean }>;
  monthsToShow?: number;
}

export default function HeatmapCalendar({
  habitId,
  tracking,
  monthsToShow = 6,
}: HeatmapCalendarProps) {
  const today = new Date();
  const maxOccurrences = 5; // Maximum occurrences of a weekday in a month

  // Generate array of months to display (current month and previous months)
  const months = Array.from({ length: monthsToShow }, (_, i) =>
    subMonths(today, monthsToShow - 1 - i)
  );

  // Create a map of completed dates for quick lookup
  const completedDates = new Set(
    tracking
      .filter((t) => t.habitId === habitId && t.completed)
      .map((t) => t.date)
  );

  // Get days grouped by week day (0 = Sunday, 1 = Monday, etc.)
  const getDaysByWeekDay = (days: Date[]) => {
    const byWeekDay: Date[][] = Array.from({ length: 7 }, () => []);
    for (const day of days) {
      const weekDay = getDay(day);
      byWeekDay[weekDay].push(day);
    }
    return byWeekDay;
  };

  return (
    <View className='rounded-xl bg-stone-50 px-4 py-3'>
      {/* Month labels */}
      <View className='mb-3 flex-row'>
        <View className='w-12' />
        {months.map((month, monthIndex) => (
          <View key={monthIndex} className='flex-1'>
            <Text className='text-center text-xs font-medium text-stone-500'>
              {format(month, 'MMM')}
            </Text>
          </View>
        ))}
      </View>

      {/* Day rows - showing Mon, Thu, Sun as in Figma */}
      {[1, 4, 0].map((dayOfWeek) => {
        const dayLabel =
          dayOfWeek === 0 ? 'Sun' : dayOfWeek === 1 ? 'Mon' : 'Thu';

        return (
          <View key={dayOfWeek} className='mb-2.5 flex-row'>
            {/* Day label */}
            <View className='w-12 justify-center'>
              <Text className='text-xs text-stone-400'>{dayLabel}</Text>
            </View>

            {/* Dots for each month */}
            {months.map((month, monthIndex) => {
              const monthStart = startOfMonth(month);
              const monthEnd = endOfMonth(month);
              const days = eachDayOfInterval({
                end: monthEnd,
                start: monthStart,
              });
              const byWeekDay = getDaysByWeekDay(days);
              const daysForThisWeekDay = byWeekDay[dayOfWeek] || [];

              return (
                <View
                  key={monthIndex}
                  className='flex-1 flex-row justify-center gap-1.5'
                >
                  {Array.from({ length: maxOccurrences }).map(
                    (_, slotIndex) => {
                      const day = daysForThisWeekDay[slotIndex];

                      if (!day) {
                        // Empty slot for alignment
                        return (
                          <View
                            key={`empty-${monthIndex}-${slotIndex}`}
                            className='h-1.5 w-1.5'
                          />
                        );
                      }

                      const dateString = format(day, 'yyyy-MM-dd');
                      const isCompleted = completedDates.has(dateString);
                      const isFuture = day > today;

                      return (
                        <View
                          key={dateString}
                          className='h-1.5 w-1.5 rounded-full'
                          style={{
                            backgroundColor: isFuture
                              ? '#e7e5e4'
                              : isCompleted
                                ? '#10b981'
                                : '#d6d3d1',
                          }}
                        />
                      );
                    }
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
