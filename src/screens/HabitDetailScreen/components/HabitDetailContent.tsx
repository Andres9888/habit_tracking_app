/** HabitDetailContent - Consistent with Create/Edit modal style */
import React from 'react';
import { ScrollView, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import type { Habit } from '../../../features/habits/types';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

const DURATION = 240;
const STAGGER = 60;

export function HabitDetailContent({
  habit,
  completedDates,
  onDayPress,
}: HabitDetailContentProps) {
  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerClassName='pb-8'
      showsVerticalScrollIndicator={false}
    >
      {/* STRENGTH section */}
      {habit.createdAt && (
        <>
          <Animated.View
            className='mb-4'
            entering={FadeInUp.duration(DURATION).delay(160)}
          >
            <Text
              className='text-center text-xs font-semibold text-stone-500'
              style={{ letterSpacing: 0.5 }}
            >
              STRENGTH
            </Text>
          </Animated.View>
          <Animated.View
            className='mx-4 rounded-2xl bg-white p-4 shadow-md'
            entering={FadeInUp.duration(DURATION).delay(160 + STAGGER)}
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

      {/* HISTORY section */}
      <Animated.View
        className='mb-4 mt-8'
        entering={FadeInUp.duration(DURATION).delay(280)}
      >
        <Text
          className='text-center text-xs font-semibold text-stone-500'
          style={{ letterSpacing: 0.5 }}
        >
          HISTORY
        </Text>
      </Animated.View>
      <Animated.View
        className='mx-4 rounded-2xl bg-white p-4 shadow-md'
        entering={FadeInUp.duration(DURATION).delay(280 + STAGGER)}
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
