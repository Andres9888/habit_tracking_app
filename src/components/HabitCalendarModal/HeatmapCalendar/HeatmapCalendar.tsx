
import { View } from 'react-native';

import { subMonths } from 'date-fns';

import type { HeatmapCalendarProps } from './types';
import { DISPLAY_DAYS } from './utils';
import { DayRow } from './DayRow';
import { MonthLabels } from './MonthLabels';

export default function HeatmapCalendar({
  habitId,
  tracking,
  monthsToShow = 6,
}: HeatmapCalendarProps) {
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
    <View className='rounded-xl bg-stone-50 px-4 py-3'>
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
