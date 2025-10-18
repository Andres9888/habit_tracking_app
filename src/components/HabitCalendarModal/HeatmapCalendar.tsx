import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { View, Text, ScrollView } from 'react-native';
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

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className='rounded-2xl bg-slate-50 p-4'
    >
      <View className='flex-row gap-4'>
        {months.map((month, monthIndex) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

          return (
            <View key={monthIndex} className='gap-2'>
              {/* Month label */}
              <Text className='text-center text-xs font-semibold text-slate-500'>
                {format(month, 'MMM')}
              </Text>

              {/* Days grid */}
              <View className='flex-row flex-wrap gap-1' style={{ width: 80 }}>
                {days.map((day) => {
                  const dateString = format(day, 'yyyy-MM-dd');
                  const isCompleted = completedDates.has(dateString);
                  const isFuture = day > today;

                  return (
                    <View
                      key={dateString}
                      className='h-2 w-2 rounded-full'
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
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
