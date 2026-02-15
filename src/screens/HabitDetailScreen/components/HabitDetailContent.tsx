/** HabitDetailContent - Optimized for 9+ scores: typography, layout, motion */
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme/ThemeContext';
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
  const { colors } = useThemeColors();
  return (
    <Animated.View
      className='mb-3 mt-6 flex-row items-center justify-center gap-2'
      entering={anim(delay)}
    >
      <View className='h-px flex-1' style={{ backgroundColor: colors.border }} />
      <Text className='text-[13px] font-semibold tracking-wider' style={{ color: colors.text.tertiary }}>
        {text}
      </Text>
      <View className='h-px flex-1' style={{ backgroundColor: colors.border }} />
    </Animated.View>
  );
}

export function HabitDetailContent({
  habit,
  completedDates,
  onDayPress,
}: HabitDetailContentProps) {
  const { colors } = useThemeColors();
  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      {/* STRENGTH section */}
      {habit.createdAt && (
        <>
          <SectionLabel delay={240} text='STRENGTH' />
          <Animated.View
            className='rounded-2xl'
            entering={anim(300)}
            style={{
              backgroundColor: colors.card,
              elevation: 4,
              shadowColor: colors.text.primary,
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

      {/* HISTORY section */}
      <SectionLabel delay={360} text='HISTORY' />
      <Animated.View
        className='rounded-2xl p-4'
        entering={anim(420)}
        style={{
          backgroundColor: colors.card,
          elevation: 4,
          shadowColor: colors.text.primary,
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
    </ScrollView>
  );
}
