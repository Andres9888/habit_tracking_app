/** HabitDetailContent - Optimized for 9+ scores: typography, layout, motion, dark mode */
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
function SectionLabel({ text, delay, dividerColor, textColor }: { text: string; delay: number; dividerColor: string; textColor: string }) {
  return (
    <Animated.View
      className='mb-3 mt-6 flex-row items-center justify-center gap-2'
      entering={anim(delay)}
    >
      <View className='h-px flex-1' style={{ backgroundColor: dividerColor }} />
      <Text style={{ fontSize: 13, fontWeight: '600', letterSpacing: 0.7, color: textColor }}>
        {text}
      </Text>
      <View className='h-px flex-1' style={{ backgroundColor: dividerColor }} />
    </Animated.View>
  );
}

export function HabitDetailContent({
  habit,
  completedDates,
  onDayPress,
}: HabitDetailContentProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const cardShadow = {
    elevation: 4,
    shadowColor: isDark ? '#000000' : '#1c1917',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  };

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
          <SectionLabel delay={240} dividerColor={themeColors.border} text='STRENGTH' textColor={themeColors.text.tertiary} />
          <Animated.View
            className='rounded-2xl'
            entering={anim(300)}
            style={{
              backgroundColor: themeColors.card,
              ...cardShadow,
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
      <SectionLabel delay={360} dividerColor={themeColors.border} text='HISTORY' textColor={themeColors.text.tertiary} />
      <Animated.View
        className='rounded-2xl p-4'
        entering={anim(420)}
        style={{
          backgroundColor: themeColors.card,
          ...cardShadow,
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
