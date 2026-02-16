import { View, Text } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { HeatmapDot } from './HeatmapDot';
import { getDaysByWeekDay, MAX_OCCURRENCES } from './utils';

interface DayRowProps {
  dayOfWeek: number;
  label: string;
  months: Date[];
  completedDates: Set<string>;
  restDays?: number[];
  today: Date;
}

export function DayRow({
  dayOfWeek,
  label,
  months,
  completedDates,
  restDays,
  today,
}: DayRowProps) {
  return (
    <View className='mb-2.5 flex-row'>
      <View className='w-12 justify-center'>
        <Text className='text-xs text-stone-400'>{label}</Text>
      </View>

      {months.map((month, monthIndex) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const days = eachDayOfInterval({ end: monthEnd, start: monthStart });
        const byWeekDay = getDaysByWeekDay(days);
        const daysForThisWeekDay = byWeekDay[dayOfWeek] || [];

        return (
          <View key={monthIndex} className='flex-1 flex-row justify-center gap-1.5'>
            {Array.from({ length: MAX_OCCURRENCES }).map((_, slotIndex) => {
              const day = daysForThisWeekDay[slotIndex];

              if (!day) {
                return <View key={`empty-${monthIndex}-${slotIndex}`} className='h-1.5 w-1.5' />;
              }

              const dateString = format(day, 'yyyy-MM-dd');
              const isRestDay = restDays && restDays.includes(day.getDay());
              return (
                <HeatmapDot
                  key={dateString}
                  isCompleted={completedDates.has(dateString)}
                  isFuture={day > today}
                  isRestDay={isRestDay && day < today}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
