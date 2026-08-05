import { subMonths } from 'date-fns';
import { View } from 'react-native';
import { MonthLabels } from './MonthLabels';
import { DayRow } from './DayRow';
import { DISPLAY_DAYS } from './utils';
import type { HeatmapCalendarProps } from './types';
import { useThemeColors } from '../../../theme/ThemeContext';

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

  return (
    <View className='rounded-xl px-4 py-3' style={{ backgroundColor: colors.background }}>
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
    </View>
  );
}
