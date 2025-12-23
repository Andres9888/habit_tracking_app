import { format, isToday } from 'date-fns';
import clsx from 'clsx';
import { Pressable, Text, View } from 'react-native';
import type { HabitStatus } from '../HabitCalendarView.hooks';

interface CalendarDayProps {
  date: Date;
  status: HabitStatus;
  onPress: () => void;
}

const STATUS_STYLES: Record<
  HabitStatus,
  { container: string; indicator: string; text: string }
> = {
  done: {
    container: 'border-transparent bg-emerald-100',
    indicator: 'bg-emerald-500',
    text: 'text-emerald-700',
  },
  missed: {
    container: 'border-transparent bg-rose-50',
    indicator: 'bg-rose-400',
    text: 'text-rose-500',
  },
  planned: {
    container: 'border-blue-200 bg-blue-50',
    indicator: 'bg-blue-500',
    text: 'text-blue-600',
  },
  upcoming: {
    container: 'border-stone-200 bg-white',
    indicator: 'bg-stone-300 opacity-60',
    text: 'text-stone-400',
  },
};

const STATUS_LABELS: Record<HabitStatus, string> = {
  done: 'Completed day',
  missed: 'Missed day',
  planned: 'Today',
  upcoming: 'Upcoming day',
};

export function CalendarDay({ date, status, onPress }: CalendarDayProps) {
  const isCurrentDay = isToday(date);
  const { container, indicator, text } = STATUS_STYLES[status];
  const isDisabled = status === 'upcoming';

  return (
    <Pressable
      accessibilityHint={
        isDisabled
          ? undefined
          : 'Toggle completion for this habit on the selected day'
      }
      accessibilityLabel={`${format(date, 'EEEE, MMMM d')}. ${STATUS_LABELS[status]}.`}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled, selected: status === 'done' }}
      className='aspect-square w-[14.28%] p-1'
      disabled={isDisabled}
      onPress={() => {
        if (!isDisabled) {
          onPress();
        }
      }}
    >
      <View
        className={clsx(
          'w-full flex-1 items-center justify-center rounded-lg border bg-white px-0.5 py-1',
          container,
          isCurrentDay && 'border-blue-400'
        )}
      >
        <Text className={clsx('text-sm font-semibold', text)}>
          {format(date, 'd')}
        </Text>
        <View className={clsx('mt-1 h-1.5 w-1.5 rounded-full', indicator)} />
      </View>
    </Pressable>
  );
}
