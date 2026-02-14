/** HabitDetailContent - Optimized for 9+ scores: typography, layout, motion */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import type { Habit } from '../../../features/habits/types';
import { ContributionGrid } from './ContributionGrid';
import { StreakStatsCard } from './StreakStatsCard';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

const cardShadow = {
  elevation: 4,
  shadowColor: '#1c1917',
  shadowOffset: { height: 4, width: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
};

/** Section label component for consistent styling */
function SectionLabel({ text, delay }: { text: string; delay: number }) {
  return (
    <Animated.View
      className='mb-3 mt-6 flex-row items-center justify-center gap-2'
      entering={anim(delay)}
    >
      <View className='h-px flex-1 bg-stone-200' />
      <Text className='text-[13px] font-semibold tracking-wider text-stone-400'>
        {text}
      </Text>
      <View className='h-px flex-1 bg-stone-200' />
    </Animated.View>
  );
}

export function HabitDetailContent({
  habit,
  completedDates,
  onDayPress,
}: HabitDetailContentProps) {
  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      {/* STREAKS section - trend arrows + best streak stat */}
      <SectionLabel delay={180} text='STREAKS' />
      <Animated.View
        className='rounded-2xl bg-white'
        entering={anim(220)}
        style={cardShadow}
      >
        <ErrorBoundary>
          <StreakStatsCard
            completedDates={completedDates}
            currentStreak={habit.currentStreak ?? 0}
            bestStreak={habit.bestStreak ?? 0}
            habitColor={habit.iconColor ?? '#047857'}
          />
        </ErrorBoundary>
      </Animated.View>

      {/* STRENGTH section */}
      {habit.createdAt && (
        <>
          <SectionLabel delay={280} text='STRENGTH' />
          <Animated.View
            className='rounded-2xl bg-white'
            entering={anim(320)}
            style={cardShadow}
          >
            <ErrorBoundary>
              <HabitStrengthSection
                completedDates={completedDates}
                habitColor={habit.iconColor}
                habitCreatedAt={habit.createdAt}
                habitId={habit._id}
                habitStrength={habit.strength}
              />
            </ErrorBoundary>
          </Animated.View>
        </>
      )}

      {/* CONTRIBUTIONS section - GitHub-style heatmap */}
      <SectionLabel delay={380} text='CONTRIBUTIONS' />
      <Animated.View
        className='rounded-2xl bg-white p-4'
        entering={anim(420)}
        style={cardShadow}
      >
        <ErrorBoundary>
          <ContributionGrid
            completedDates={completedDates}
            habitColor={habit.iconColor ?? '#047857'}
          />
        </ErrorBoundary>
      </Animated.View>

      {/* HISTORY section - monthly calendar */}
      <SectionLabel delay={480} text='HISTORY' />
      <Animated.View
        className='rounded-2xl bg-white p-4'
        entering={anim(520)}
        style={cardShadow}
      >
        <ErrorBoundary>
          <MonthlyCalendarGrid
            completedDates={completedDates}
            habitColor={habit.iconColor ?? '#047857'}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            onDayPress={onDayPress}
          />
        </ErrorBoundary>
      </Animated.View>
    </ScrollView>
  );
}
