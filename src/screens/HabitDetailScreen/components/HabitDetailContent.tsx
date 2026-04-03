/** HabitDetailContent - Tabbed layout: Calendar vs Habit Strength */
import { useCallback, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme';
import { shadows } from '../../../theme/spacing';
import type { Habit } from '../../../features/habits/types';
import { DetailViewTabs, type DetailView } from './DetailViewTabs';
import { QuickStatsRow } from './QuickStatsRow';
import { YearHeatmapSection } from './YearHeatmapSection';

interface HabitDetailContentProps {
  completedDates: Set<string>;
  habit: Habit;
  totalCompletions: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

export function HabitDetailContent({
  completedDates,
  habit,
  totalCompletions,
  onDayPress,
}: HabitDetailContentProps) {
  const { colors } = useThemeColors();
  const [activeView, setActiveView] = useState<DetailView>('calendar');
  const scrollRef = useRef<ScrollView>(null);
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const cardBg = colors.card;
  const strengthHint =
    typeof habit.strength === 'number'
      ? `${Math.round(habit.strength * 100)}%`
      : undefined;

  const handleViewChange = useCallback((view: DetailView) => {
    setActiveView(view);
    scrollRef.current?.scrollTo({ animated: true, y: 0 });
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      bounces
      className='flex-1'
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      <QuickStatsRow
        bestStreak={habit.bestStreak ?? 0}
        currentStreak={habit.currentStreak ?? 0}
        totalCompletions={totalCompletions}
      />

      <DetailViewTabs
        activeView={activeView}
        calendarHint={`${completedDates.size} days`}
        strengthHint={strengthHint}
        onViewChange={handleViewChange}
      />

      {activeView === 'calendar' ? (
        <Animated.View entering={FadeInDown.duration(300).springify().damping(20)}>
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
      ) : habit.createdAt ? (
        <Animated.View
          className='mt-2 rounded-2xl'
          entering={FadeInDown.duration(300).springify().damping(20)}
          style={{ backgroundColor: cardBg, ...shadows.card }}
        >
          <ErrorBoundary>
            <HabitStrengthSection
              completedDates={completedDates}
              habitColor={habit.color ?? habit.iconColor}
              habitCreatedAt={habit.createdAt}
              habitId={habit._id}
              habitStrength={habit.strength}
            />
          </ErrorBoundary>
        </Animated.View>
      ) : null}
    </ScrollView>
  );
}
