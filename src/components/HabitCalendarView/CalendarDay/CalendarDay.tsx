import { format, isToday } from 'date-fns';
import { Pressable, Text, View } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { SemanticColors } from '../../../theme/darkColors';
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

interface StatusStyles {
  container: ViewStyle;
  indicator: ViewStyle;
  text: TextStyle;
}

/**
 * Maps habit status to appropriate styling based on theme.
 * Uses semantic colors from ThemeContext for dark mode support.
 */
function getStatusStyles(
  status: HabitStatus,
  colors: SemanticColors,
): StatusStyles {
  switch (status) {
    case 'done': {
      return {
        container: { borderColor: 'transparent', backgroundColor: colors.status.successLight },
        indicator: { backgroundColor: colors.status.success },
        text: { color: colors.status.successText },
      };
    }
    case 'missed': {
      return {
        container: { borderColor: 'transparent', backgroundColor: colors.status.errorLight },
        indicator: { backgroundColor: colors.status.error },
        text: { color: colors.status.errorText },
      };
    }
    case 'planned': {
      return {
        container: { borderColor: colors.status.success, backgroundColor: colors.status.successLight },
        indicator: { backgroundColor: colors.status.success },
        text: { color: colors.status.successText },
      };
    }
    default: {
      return {
        container: { borderColor: 'transparent', backgroundColor: colors.card },
        indicator: { backgroundColor: colors.gray[300], opacity: 0.6 },
        text: { color: colors.text.tertiary },
      };
    }
  }
}

export function CalendarDay({ date, status, onPress }: CalendarDayProps) {
  const { colors } = useThemeColors();
  const isCurrentDay = isToday(date);
  const { container, indicator, text } = getStatusStyles(status, colors);
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
        className='w-full flex-1 items-center justify-center rounded-lg border px-0.5 py-1'
        style={[
          container,
          isCurrentDay ? { borderColor: colors.status.success } : undefined,
        ]}
      >
        <Text className='text-sm font-semibold' style={text}>
          {format(date, 'd')}
        </Text>
        <View className='mt-1 h-1.5 w-1.5 rounded-full' style={indicator} />
      </View>
    </Pressable>
  );
}
