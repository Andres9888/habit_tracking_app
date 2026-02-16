import { format, isToday } from 'date-fns';
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

export function CalendarDay({ date, status, onPress }: CalendarDayProps) {
  const { colors, isDark } = useThemeColors();
  const isCurrentDay = isToday(date);
  const isDisabled = status === 'upcoming';

  const getStatusStyles = () => {
    switch (status) {
      case 'done':
        return {
          bg: isDark ? 'rgba(16,185,129,0.15)' : colors.primary[100],
          border: 'transparent',
          dot: colors.primary[500],
          text: colors.primary[700],
        };
      case 'missed':
        return {
          bg: isDark ? 'rgba(244,63,94,0.1)' : '#FFF1F2',
          border: 'transparent',
          dot: '#FB7185',
          text: '#FB7185',
        };
      case 'planned':
        return {
          bg: isDark ? 'rgba(16,185,129,0.08)' : '#ECFDF5',
          border: colors.primary[500],
          dot: colors.primary[500],
          text: colors.primary[600],
        };
      case 'upcoming':
      default:
        return {
          bg: isDark ? colors.gray[800] : colors.gray[50],
          border: colors.gray[200],
          dot: colors.gray[300],
          text: colors.text.tertiary,
        };
    }
  };

  const styles = getStatusStyles();

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
        className='w-full flex-1 items-center justify-center rounded-lg px-0.5 py-1'
        style={{
          backgroundColor: styles.bg,
          borderColor: isCurrentDay ? colors.primary[400] : styles.border,
          borderWidth: isCurrentDay || status === 'planned' ? 1.5 : 1,
        }}
      >
        <Text
          className='text-sm font-semibold'
          style={{ color: styles.text }}
        >
          {format(date, 'd')}
        </Text>
        <View
          className='mt-1 h-1.5 w-1.5 rounded-full'
          style={{
            backgroundColor: styles.dot,
            opacity: status === 'upcoming' ? 0.6 : 1,
          }}
        />
      </View>
    </Pressable>
  );
}
