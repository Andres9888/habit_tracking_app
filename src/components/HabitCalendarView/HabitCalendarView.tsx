import { format } from 'date-fns';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import type { Id } from '../../../convex/_generated/dataModel';
import { useHabitCalendarViewLogic } from './HabitCalendarView.hooks';
import { CalendarHeader } from './CalendarHeader';
import { DayNamesRow } from './DayNamesRow';
import { CalendarDay } from './CalendarDay';
import { CalendarLegend } from './CalendarLegend';

interface HabitCalendarViewProps {
  habitId: Id<'habits'>;
  tracking: Array<{ habitId: Id<'habits'>; date: string; completed: boolean }>;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
}

export default function HabitCalendarView({
  habitId,
  tracking,
  toggleHabit,
}: HabitCalendarViewProps) {
  const {
    currentMonth,
    daysInMonth,
    emptyDays,
    getHabitStatus,
    getStreakConnection,
    handlePreviousMonth,
    handleNextMonth,
    handleToday,
  } = useHabitCalendarViewLogic({ habitId, tracking });

  // Swipe gesture for month navigation
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      if (event.translationX > 50) {
        // Swipe right - previous month
        handlePreviousMonth();
      } else if (event.translationX < -50) {
        // Swipe left - next month
        handleNextMonth();
      }
    });

  return (
    <View style={styles.container}>
      <CalendarHeader
        currentMonth={currentMonth}
        onNext={handleNextMonth}
        onPrevious={handlePreviousMonth}
        onToday={handleToday}
      />

      <GestureDetector gesture={swipeGesture}>
        <View style={styles.calendarGrid}>
          <DayNamesRow />

          <View style={styles.weekRow}>
            {emptyDays.map((i) => (
              <View
                key={`empty-${i}`}
                style={styles.emptyDay}
              />
            ))}

            {daysInMonth.map((date) => {
              const dateString = format(date, 'yyyy-MM-dd');
              const status = getHabitStatus(dateString);
              const streakConnection = getStreakConnection(dateString);

              return (
                <CalendarDay
                  key={dateString}
                  date={date}
                  status={status}
                  streakConnection={streakConnection}
                  onPress={() => toggleHabit({ date: dateString, habitId })}
                />
              );
            })}
          </View>

          <CalendarLegend />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  calendarGrid: {
    // Container for swipable calendar content
  },
  weekRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  emptyDay: {
    aspectRatio: 1,
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
});
