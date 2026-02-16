import { format, isToday, getDay } from 'date-fns';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { HabitStatus, StreakConnection } from '../HabitCalendarView.hooks';

interface CalendarDayProps {
  date: Date;
  status: HabitStatus;
  streakConnection?: StreakConnection;
  onPress: () => void;
}

const STATUS_LABELS: Record<HabitStatus, string> = {
  done: 'Completed day',
  missed: 'Missed day',
  planned: 'Today',
  upcoming: 'Upcoming day',
};

export function CalendarDay({
  date,
  status,
  streakConnection,
  onPress,
}: CalendarDayProps) {
  const { colors } = useThemeColors();
  const isCurrentDay = isToday(date);
  const isWeekend = getDay(date) === 0 || getDay(date) === 6; // Sunday or Saturday
  const isDisabled = status === 'upcoming';
  const hasStreakConnection =
    status === 'done' &&
    streakConnection &&
    (streakConnection.connectLeft || streakConnection.connectRight);

  // Determine status-specific styles based on theme
  const statusStyles = (() => {
    switch (status) {
      case 'done':
        return {
          backgroundColor: colors.primary[100],
          borderColor: 'transparent',
          indicatorColor: colors.primary[500],
          textColor: colors.primary[700],
        };
      case 'missed':
        return {
          backgroundColor: colors.gray[100],
          borderColor: 'transparent',
          indicatorColor: '#F87171', // rose-400 equivalent
          textColor: '#F43F5E', // rose-500 equivalent
        };
      case 'planned':
        return {
          backgroundColor: colors.primary[100], // Use 100 instead of 50
          borderColor: colors.primary[300],
          indicatorColor: colors.primary[500],
          textColor: colors.primary[600],
        };
      case 'upcoming':
      default:
        return {
          backgroundColor: colors.card,
          borderColor: colors.border,
          indicatorColor: colors.gray[400],
          textColor: colors.gray[400],
        };
    }
  })();

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
      style={sheet.dayContainer}
      disabled={isDisabled}
      onPress={() => {
        if (!isDisabled) {
          onPress();
        }
      }}
    >
      {/* Left connector line */}
      {hasStreakConnection && streakConnection?.connectLeft && (
        <View
          style={[
            sheet.connector,
            sheet.connectorLeft,
            { backgroundColor: colors.primary[500] },
          ]}
        />
      )}

      <View
        style={[
          sheet.cell,
          {
            backgroundColor: statusStyles.backgroundColor,
            borderColor: isCurrentDay
              ? colors.primary[500]
              : statusStyles.borderColor,
            borderWidth: isCurrentDay ? 2 : 1,
          },
        ]}
      >
        <Text
          style={[
            sheet.dayText,
            {
              color: isWeekend && status === 'upcoming'
                ? colors.primary[400]
                : statusStyles.textColor,
            },
          ]}
        >
          {format(date, 'd')}
        </Text>
        <View
          style={[
            sheet.indicator,
            {
              backgroundColor: statusStyles.indicatorColor,
              opacity: status === 'upcoming' ? 0.6 : 1,
            },
          ]}
        />
      </View>

      {/* Right connector line */}
      {hasStreakConnection && streakConnection?.connectRight && (
        <View
          style={[
            sheet.connector,
            sheet.connectorRight,
            { backgroundColor: colors.primary[500] },
          ]}
        />
      )}
    </Pressable>
  );
}

const sheet = StyleSheet.create({
  dayContainer: {
    aspectRatio: 1,
    width: '14.28%',
    padding: 4,
    position: 'relative',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  indicator: {
    marginTop: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  connector: {
    position: 'absolute',
    height: 3,
    top: '50%',
    marginTop: -1.5,
    borderRadius: 2,
    zIndex: -1,
  },
  connectorLeft: {
    right: '50%',
    width: '50%',
  },
  connectorRight: {
    left: '50%',
    width: '50%',
  },
});
