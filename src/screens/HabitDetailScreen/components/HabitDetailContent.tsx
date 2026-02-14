/** HabitDetailContent - Premium detail screen with stats, streaks, and share */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { QuickStatsCards } from './QuickStatsCards';
import { ContributionGrid } from './ContributionGrid';
import { ShareStreakButton } from './ShareStreakButton';
import type { Habit } from '../../../features/habits/types';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

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
      contentContainerClassName='pb-10 px-4'
      showsVerticalScrollIndicator={false}
    >
      {/* QUICK STATS - Completion rate + trend, current vs best streak */}
      <SectionLabel delay={60} text='OVERVIEW' />
      <QuickStatsCards completedDates={completedDates} baseDelay={120} />

      {/* STREAK CALENDAR - GitHub-style contribution grid */}
      <SectionLabel delay={180} text='STREAK CALENDAR' />
      <ContributionGrid
        completedDates={completedDates}
        habitColor={habit.iconColor ?? '#047857'}
        baseDelay={240}
      />

      {/* STRENGTH section */}
      {habit.createdAt && (
        <>
          <SectionLabel delay={300} text='STRENGTH' />
          <Animated.View
            className='rounded-2xl bg-white'
            entering={anim(360)}
            style={{
              elevation: 4,
              shadowColor: '#1c1917',
              shadowOffset: { height: 4, width: 0 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
            }}
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

      {/* HISTORY section - Monthly calendar */}
      <SectionLabel delay={420} text='HISTORY' />
      <Animated.View
        className='rounded-2xl bg-white p-4'
        entering={anim(480)}
        style={{
          elevation: 4,
          shadowColor: '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        }}
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

      {/* SHARE STREAK button */}
      <ShareStreakButton
        habitName={habit.name}
        completedDates={completedDates}
        baseDelay={540}
      />
    </ScrollView>
  );
}
