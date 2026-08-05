/**
 * HabitDetailContent - Scrollspy layout: Hero → sticky tabs → Calendar + Strength + Time + Goals + Why stacked.
 * Tabs act as anchors, not gatekeepers. Every progress surface is visible in one scroll.
 */
import { useRef } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme';
import { shadows } from '../../../theme/spacing';
import type { Habit } from '../../../features/habits/types';
import { CalendarTabContent } from './CalendarTabContent';
import { DetailHero } from './DetailHero';
import { DetailViewTabs, type DetailView } from './DetailViewTabs';
import { GoalsTabContent } from './GoalsTabContent';
import { HabitWhyBenefitsCard } from './HabitWhyBenefitsCard';
import { WeeklyTimeCard } from './WeeklyTimeCard';
import { computeCompletionRate } from './HabitDetailContent.utils';
import { useDetailScrollSpy } from './useDetailScrollSpy';

interface HabitDetailContentProps {
  completedDates: Set<string>;
  habit: Habit;
  isCompletedToday: boolean;
  totalCompletions: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
  onPinnedChange?: (pinned: boolean) => void;
}

export function HabitDetailContent({
  completedDates,
  habit,
  isCompletedToday,
  totalCompletions,
  onDayPress,
  onPinnedChange,
}: HabitDetailContentProps) {
  const { colors } = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);
  const { activeView, handleScroll, handleSectionLayout, scrollToView } =
    useDetailScrollSpy(scrollRef, { onPinnedChange });
  const habitColor = habit.color ?? habit.iconColor ?? colors.primary[700];
  const completionRate = computeCompletionRate(habit, totalCompletions);

  const makeSectionLayoutHandler = (view: DetailView) => (event: LayoutChangeEvent) => {
    handleSectionLayout(view, event.nativeEvent.layout.y);
  };

  return (
    <ScrollView
      ref={scrollRef}
      bounces
      className='flex-1'
      contentContainerClassName='pb-16'
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[1]}
      onScroll={handleScroll}
    >
      <DetailHero
        habit={habit}
        isCompletedToday={isCompletedToday}
        totalCompletions={totalCompletions}
      />
      <DetailViewTabs activeView={activeView} onViewChange={scrollToView} />

      <View className='px-4 pt-2' onLayout={makeSectionLayoutHandler('calendar')}>
        <CalendarTabContent
          completedDates={completedDates}
          habit={habit}
          habitColor={habitColor}
          onDayPress={onDayPress}
        />
      </View>

      {habit.createdAt ? (
        <View
          className='mx-4 mt-4 rounded-2xl'
          style={{ backgroundColor: colors.card, ...shadows.card }}
          onLayout={makeSectionLayoutHandler('strength')}
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
        </View>
      ) : null}

      <View className='mx-4 mt-4' onLayout={makeSectionLayoutHandler('time')}>
        <ErrorBoundary>
          <WeeklyTimeCard
            dailyMinutesGoal={habit.dailyMinutesGoal}
            habitColor={habitColor}
            habitId={habit._id}
            weeklyMinutesGoal={habit.weeklyMinutesGoal}
          />
        </ErrorBoundary>
      </View>

      <View className='mx-4 mt-4' onLayout={makeSectionLayoutHandler('goals')}>
        <ErrorBoundary>
          <GoalsTabContent completionRate={completionRate} habit={habit} />
        </ErrorBoundary>
      </View>

      <View className='mx-4 mt-4' onLayout={makeSectionLayoutHandler('why')}>
        <ErrorBoundary>
          <HabitWhyBenefitsCard habit={habit} />
        </ErrorBoundary>
      </View>
    </ScrollView>
  );
}
