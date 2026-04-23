/**
 * CalendarTabContent — Year heatmap + monthly grid calendar view.
 */
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { YearHeatmapSection } from './YearHeatmapSection';

interface CalendarTabContentProps {
  completedDates: Set<string>;
  habit: Habit;
  habitColor: string;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function CalendarTabContent({
  completedDates,
  habit,
  habitColor,
  onDayPress,
}: CalendarTabContentProps) {
  return (
    <Animated.View entering={FadeInDown.duration(300).easing(Easing.out(Easing.cubic))}>
      <ErrorBoundary>
        <YearHeatmapSection
          completedDates={completedDates}
          habitColor={habitColor}
          habitCreatedAt={habit.createdAt}
          habitId={habit._id}
          onDayPress={onDayPress}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <MonthlyCalendarGrid
          completedDates={completedDates}
          habitColor={habitColor}
          habitCreatedAt={habit.createdAt}
          habitId={habit._id}
          onDayPress={onDayPress}
        />
      </ErrorBoundary>
    </Animated.View>
  );
}
