import { format, isToday } from 'date-fns';
import clsx from 'clsx';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { HabitStatus } from '../HabitCalendarView.hooks';

interface CalendarDayProps {
  date: Date;
  status: HabitStatus;
  onPress: () => void;
}

const STATUS_LABELS: Record<HabitStatus, string> = {
  done: 'Completed day',
  missed: 'Missed day',
  planned: 'Today',
  upcoming: 'Upcoming day',
};

/**
 * Maps habit status to appropriate styling based on theme.
 * Uses semantic colors from ThemeContext for dark mode support.
 */
function getStatusStyles(
  status: HabitStatus,
  isDark: boolean
): { container: string; indicator: string; text: string } {
  if (isDark) {
    // Dark mode color scheme
    switch (status) {
      case 'done': {
        return {
          container: 'border-emerald-600 bg-emerald-900',
          indicator: 'bg-emerald-400',
          text: 'text-emerald-200',
        };
      }
      case 'missed': {
        return {
          container: 'border-rose-600 bg-rose-900',
          indicator: 'bg-rose-400',
          text: 'text-rose-200',
        };
      }
      case 'planned': {
        return {
          container: 'border-emerald-600 bg-emerald-900',
          indicator: 'bg-emerald-400',
          text: 'text-emerald-200',
        };
      }
      case 'upcoming':
      default: {
        return {
          container: 'border-gray-600 bg-gray-800',
          indicator: 'bg-gray-600 opacity-40',
          text: 'text-gray-400',
        };
      }
    }
  }

  // Light mode color scheme (original)
  switch (status) {
    case 'done': {
      return {
        container: 'border-transparent bg-emerald-100',
        indicator: 'bg-emerald-500',
        text: 'text-emerald-700',
      };
    }
    case 'missed': {
      return {
        container: 'border-transparent bg-rose-50',
        indicator: 'bg-rose-400',
        text: 'text-rose-500',
      };
    }
    case 'planned': {
      return {
        container: 'border-emerald-200 bg-emerald-50',
        indicator: 'bg-emerald-500',
        text: 'text-emerald-600',
      };
    }
    case 'upcoming':
    default: {
      return {
        container: 'border-stone-200 bg-white',
        indicator: 'bg-stone-300 opacity-60',
        text: 'text-stone-400',
      };
    }
  }
}

export function CalendarDay({ date, status, onPress }: CalendarDayProps) {
  const { isDark } = useThemeColors();
  const isCurrentDay = isToday(date);
  const { container, indicator, text } = getStatusStyles(status, isDark);
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
          'w-full flex-1 items-center justify-center rounded-lg border px-0.5 py-1',
          container,
          isCurrentDay && isDark ? 'border-emerald-300' : 'border-emerald-400'
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
