/**
 * CalendarTabContent — Stat strip + chain grid hero + year heatmap + monthly grid.
 */
import { useMemo } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import type { Habit } from '../../../features/habits/types';
import { ChainGridCard } from './ChainGridCard';
import { buildRecentDays } from './ChainGridCard/buildRecentDays';
import { StatStrip } from './StatStrip';
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
  const recentDays = useMemo(
    () => buildRecentDays(completedDates),
    [completedDates]
  );
  const currentStreak = habit.currentStreak ?? 0;
  const bestStreak = habit.bestStreak ?? currentStreak;
  const strength = Math.round(habit.strength ?? 0);

  return (
    <Animated.View entering={FadeInDown.duration(300).springify().damping(20)}>
      <ErrorBoundary>
        <StatStrip
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          strength={strength}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <ChainGridCard
          bestStreak={bestStreak}
          currentStreak={currentStreak}
          days={recentDays}
        />
      </ErrorBoundary>
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
