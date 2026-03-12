import { format } from 'date-fns';
import { View } from 'react-native';
import type { Id } from '../../../convex/_generated/dataModel';
import { useHabitCalendarViewLogic } from './HabitCalendarView.hooks';
import type { HabitCalendarViewState } from './HabitCalendarView.hooks';
import { CalendarHeader } from './CalendarHeader';
import { DayNamesRow } from './DayNamesRow';
import { CalendarDay } from './CalendarDay';
import { CalendarLegend } from './CalendarLegend';

interface HabitCalendarViewProps {
  habitId: Id<'habits'>;
  tracking: Array<{ habitId: Id<'habits'>; date: string; completed: boolean }>;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  showHeader?: boolean;
  calendarViewState?: HabitCalendarViewState;
}

export default function HabitCalendarView({
  habitId,
  tracking,
  toggleHabit,
  showHeader = true,
  calendarViewState,
}: HabitCalendarViewProps) {
  const internalCalendarViewState = useHabitCalendarViewLogic({ habitId, tracking });
  const {
    currentMonth,
    daysInMonth,
    emptyDays,
    getHabitStatus,
    handlePreviousMonth,
    handleNextMonth,
    handleToday,
  } = calendarViewState ?? internalCalendarViewState;

  return (
    <View className='gap-4'>
      {showHeader ? <CalendarHeader
          currentMonth={currentMonth}
          onNext={handleNextMonth}
          onPrevious={handlePreviousMonth}
          onToday={handleToday}
        /> : null}

      <DayNamesRow />

      <View className='flex-row flex-wrap px-1'>
        {emptyDays.map((i) => (
          <View
            key={`empty-${i}`}
            className='aspect-square w-[14.28%] items-center justify-center p-0.5'
          />
        ))}

        {daysInMonth.map((date) => {
          const dateString = format(date, 'yyyy-MM-dd');
          const status = getHabitStatus(dateString);

          return (
            <CalendarDay
              key={dateString}
              date={date}
              status={status}
              onPress={() => toggleHabit({ date: dateString, habitId })}
            />
          );
        })}
      </View>

      <CalendarLegend />
    </View>
  );
}
