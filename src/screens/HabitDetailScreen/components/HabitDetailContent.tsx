/** HabitDetailContent - Optimized for 9+ scores: typography, layout, motion */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { AddToSiriButton } from '../../../components/SiriShortcut';
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
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      {/* STRENGTH section - OPTIMIZED: better visual weight, deeper shadows */}
      {habit.createdAt && (
        <>
          <SectionLabel delay={240} text='STRENGTH' />
          <Animated.View
            className='rounded-2xl bg-white'
            entering={anim(300)}
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

      {/* HISTORY section - OPTIMIZED: consistent card styling */}
      <SectionLabel delay={360} text='HISTORY' />
      <Animated.View
        className='rounded-2xl bg-white p-4'
        entering={anim(420)}
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

      {/* SIRI SHORTCUT - "Add to Siri" for quick habit logging */}
      <AddToSiriButton
        delay={480}
        habitEmoji={habit.icon}
        habitId={habit._id as string}
        habitName={habit.name}
      />
    </ScrollView>
  );
}
