/** HabitDetailContent - Dark mode + a11y optimized, with quick stats */
import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme';
import { shadows } from '../../../theme/spacing';
import type { Habit } from '../../../features/habits/types';
import { QuickStatsRow } from './QuickStatsRow';
import { SectionLabel } from './SectionLabel';

interface HabitDetailContentProps {
  completedDates: Set<string>;
  daysTracking: number;
  habit: Habit;
  totalCompletions: number;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function HabitDetailContent({
  completedDates,
  daysTracking,
  habit,
  totalCompletions,
  onDayPress,
}: HabitDetailContentProps) {
  const { colors, isDark } = useThemeColors();
  const cardBg = isDark ? colors.card : '#FFFFFF';
  const borderColor = isDark ? colors.border : '#DDD8D2';
  const labelColor = isDark ? colors.text.tertiary : '#9C958D';

  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      <QuickStatsRow
        bestStreak={habit.bestStreak ?? 0}
        daysTracking={daysTracking}
        totalCompletions={totalCompletions}
      />

      <SectionLabel
        borderColor={borderColor}
        delay={240}
        text='HISTORY'
        textColor={labelColor}
      />
      <ErrorBoundary>
        <MonthlyCalendarGrid
          completedDates={completedDates}
          habitColor={habit.color ?? habit.iconColor ?? colors.primary[700]}
          habitCreatedAt={habit.createdAt}
          habitId={habit._id}
          onDayPress={onDayPress}
        />
      </ErrorBoundary>

      {habit.createdAt && (
        <>
          <SectionLabel
            borderColor={borderColor}
            delay={360}
            text='STRENGTH'
            textColor={labelColor}
          />
          <Animated.View
            className='rounded-2xl'
            entering={anim(420)}
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
        </>
      )}
    </ScrollView>
  );
}
