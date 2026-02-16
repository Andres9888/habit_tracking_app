import { subMonths } from 'date-fns';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { MonthLabels } from './MonthLabels';
import { DayRow } from './DayRow';
import { DISPLAY_DAYS } from './utils';
import type { HeatmapCalendarProps } from './types';

export default function HeatmapCalendar({
  habitId,
  tracking,
  monthsToShow = 6,
}: HeatmapCalendarProps) {
  const { colors } = useThemeColors();
  const today = new Date();

  const months = Array.from({ length: monthsToShow }, (_, i) =>
    subMonths(today, monthsToShow - 1 - i)
  );

  const completedDates = new Set(
    tracking
      .filter((t) => t.habitId === habitId && t.completed)
      .map((t) => t.date)
  );

  const hasData = completedDates.size > 0;

  return (
    <View
      className='rounded-xl px-4 py-3'
      style={{ backgroundColor: colors.card }}
    >
      <MonthLabels months={months} />
      {DISPLAY_DAYS.map(({ dayOfWeek, label }) => (
        <DayRow
          key={dayOfWeek}
          completedDates={completedDates}
          dayOfWeek={dayOfWeek}
          label={label}
          months={months}
          today={today}
        />
      ))}
      {!hasData && (
        <Text
          className='py-4 text-center text-sm'
          style={{ color: colors.text.tertiary }}
        >
          No completions yet — start your streak!
        </Text>
      )}
    </View>
  );
}
