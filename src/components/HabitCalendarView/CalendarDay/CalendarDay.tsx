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
      className='aspect-square w-[14.28%] items-center justify-center py-1.5'
      disabled={isFuture}
      onPress={() => !isFuture && onPress()}
    >
      <View className='items-center justify-center gap-1'>
        <Text
          className={clsx(
            'text-base font-normal text-slate-700',
            status === 'done' && 'font-bold text-emerald-600',
            status === 'missed' && 'text-slate-400',
            isFuture && 'text-slate-300'
          )}
        >
          {format(date, 'd')}
        </Text>
        {status === 'done' && (
          <View className='h-1.5 w-1.5 rounded-full bg-emerald-600' />
        )}
      </View>
    </Pressable>
  );
}
