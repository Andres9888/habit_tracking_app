/**
 * CalendarTabContent — Year heatmap (top) + interactive monthly grid.
 */
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { parseISO, startOfMonth } from 'date-fns';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { YearHeatmapSection } from './YearHeatmapSection';

interface CalendarTabContentProps {
  completedDates: Set<string>;
  habit: Habit;
  habitColor: string;
  isToggling?: boolean;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function CalendarTabContent({
  completedDates,
  habit,
  habitColor,
  isToggling = false,
  onDayPress,
}: CalendarTabContentProps) {
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(new Date())
  );

  const navigateToMonth = useCallback((dateString: string) => {
    const parsed = parseISO(dateString);
    if (!Number.isNaN(parsed.getTime())) setCurrentMonth(startOfMonth(parsed));
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(180)}>
      <ErrorBoundary>
        <YearHeatmapSection
          completedDates={completedDates}
          currentStreak={habit.currentStreak ?? 0}
          habitColor={habitColor}
          habitCreatedAt={habit.createdAt}
          habitId={habit._id}
          onDayPress={onDayPress}
          onNavigateToMonth={navigateToMonth}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <View className='mt-4'>
          <MonthlyCalendarGrid
            completedDates={completedDates}
            currentMonth={currentMonth}
            habitColor={habitColor}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            isToggling={isToggling}
            showStreakInInsights={false}
            useSolidCompletedFill
            onCurrentMonthChange={setCurrentMonth}
            onDayPress={onDayPress}
          />
        </View>
      </ErrorBoundary>
    </Animated.View>
  );
}
