import { subMonths } from 'date-fns';
import { useMemo } from 'react';
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
  // All three are memoized because `months`, `today` and `completedDates` are
  // passed to every DayRow. Rebuilding them each render churned their identity
  // and invalidated the whole grid below, on top of re-scanning the full
  // tracking array.
  const today = useMemo(() => new Date(), []);

  const months = useMemo(
    () =>
      Array.from({ length: monthsToShow }, (_, i) =>
        subMonths(today, monthsToShow - 1 - i)
      ),
    [monthsToShow, today]
  );

  const completedDates = useMemo(
    () =>
      new Set(
        tracking
          .filter((t) => t.habitId === habitId && t.completed)
          .map((t) => t.date)
      ),
    [habitId, tracking]
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
