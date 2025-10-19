import { format, isToday } from 'date-fns';
import { View, Text, Pressable } from 'react-native';
import clsx from 'clsx';
import type { Id } from '../../../convex/_generated/dataModel';

interface CalendarDayProps {
  date: Date;
  habitId: Id<'habits'>;
  status: 'done' | 'missed' | 'planned' | 'none';
  onPress: () => void;
}

export function CalendarDay({ date, status, onPress }: CalendarDayProps) {
  const dateString = format(date, 'yyyy-MM-dd');
  const isCurrentDay = isToday(date);

  // Parse date in local timezone
  const [year, month, day] = dateString.split('-').map(Number);
  const checkDate = new Date(year, month - 1, day);
  const todayCheck = new Date();
  todayCheck.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  const isFuture = checkDate > todayCheck;

  return (
    <Pressable
      className='aspect-square w-[14.28%] items-center justify-center p-1'
      disabled={isFuture}
      onPress={() => !isFuture && onPress()}
    >
      <View className='flex-1 w-full items-center justify-center gap-0.5'>
        {/* Date Number with Current Day Indicator */}
        <View
          className={clsx(
            'items-center justify-center rounded-full',
            isCurrentDay && 'h-8 w-8 bg-slate-900'
          )}
        >
          <Text
            className={clsx(
              'text-base font-semibold',
              isCurrentDay
                ? 'text-white'
                : status === 'done'
                  ? 'text-slate-900'
                  : isFuture
                    ? 'text-slate-300'
                    : 'text-slate-900'
            )}
          >
            {format(date, 'd')}
          </Text>
        </View>

        {/* Completion Dot */}
        {status === 'done' && (
          <View className='mt-0.5 h-1 w-1 rounded-full bg-blue-500' />
        )}
      </View>
    </Pressable>
  );
}
