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
    days.forEach((day) => {
      const weekDay = getDay(day);
      byWeekDay[weekDay].push(day);
    });
    return byWeekDay;
  };

  return (
    <View className='rounded-xl bg-slate-50 p-4'>
      {/* Month labels */}
      <View className='mb-2 flex-row'>
        <View className='w-10' />
        {months.map((month, monthIndex) => (
          <View key={monthIndex} className='w-12 items-center'>
            <Text className='text-xs font-medium text-slate-500'>
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
          <View key={dayOfWeek} className='mb-1 flex-row items-center'>
            {/* Day label */}
            <View className='w-10'>
              <Text className='text-xs text-slate-400'>{dayLabel}</Text>
            </View>

            {/* Dots for each month */}
            {months.map((month, monthIndex) => {
              const monthStart = startOfMonth(month);
              const monthEnd = endOfMonth(month);
              const days = eachDayOfInterval({
                start: monthStart,
                end: monthEnd,
              });
              const byWeekDay = getDaysByWeekDay(days);
              const daysForThisWeekDay = byWeekDay[dayOfWeek] || [];

              return (
                <View
                  key={monthIndex}
                  className='w-12 flex-row flex-wrap gap-0.5'
                >
                  {daysForThisWeekDay.map((day) => {
                    const dateString = format(day, 'yyyy-MM-dd');
                    const isCompleted = completedDates.has(dateString);
                    const isFuture = day > today;

                    return (
                      <View
                        key={dateString}
                        className='h-1.5 w-1.5 rounded-full'
                        style={{
                          backgroundColor: isFuture
                            ? '#e2e8f0'
                            : isCompleted
                              ? '#10b981'
                              : '#cbd5e1',
                        }}
                      />
                    );
                  })}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
