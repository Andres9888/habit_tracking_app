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
      className='aspect-square w-[14.28%] items-center justify-center p-0.5'
      disabled={isFuture}
      onPress={() => !isFuture && onPress()}
    >
      <View
        className={clsx(
          'flex-1 items-center justify-center rounded-xl border bg-white',
          status === 'done' && 'border-2 border-emerald-500 bg-emerald-50',
          status === 'missed' && 'border-dashed border-slate-200 bg-gray-50 opacity-70',
          status === 'planned' && 'border-2 border-blue-500 bg-blue-50',
          isFuture && 'border-slate-100 opacity-30',
          isCurrentDay && 'border-2 border-slate-900'
        )}
      >
        <Text
          className={clsx(
            'text-[13px] font-medium text-slate-500',
            status === 'done' && 'font-semibold text-emerald-600',
            status === 'missed' && 'text-slate-500',
            isFuture && 'text-slate-300',
            isCurrentDay && 'font-bold text-slate-900'
          )}
        >
          {format(date, 'd')}
        </Text>
        {status === 'done' && <View className='mt-0.5 h-1 w-1 rounded-full bg-emerald-600' />}
      </View>
    </Pressable>
  );
}
