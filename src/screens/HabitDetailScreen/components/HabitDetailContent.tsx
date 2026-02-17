/* eslint-disable max-lines */
/** HabitDetailContent - Dark mode + a11y optimized */
import React, { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MonthlyCalendarGrid } from '../../../components/BinaryHeatmap';
import { ChainVisualizationBanner } from '../../../components/ChainVisualizationBanner';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { HabitStrengthSection } from '../../../components/HabitStrengthSection';
import { useThemeColors } from '../../../theme';
import { colors } from '../../../theme/colors';
import type { Habit } from '../../../features/habits/types';

interface HabitDetailContentProps {
  habit: Habit;
  completedDates: Set<string>;
  notesByDate?: Record<string, string>;
  onDayPress: (dateString: string, isCompleted: boolean) => void;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

/** Section label component for consistent styling */
function SectionLabel({
  text,
  delay,
  borderColor,
  textColor,
}: {
  text: string;
  delay: number;
  borderColor: string;
  textColor: string;
}) {
  return (
    <Animated.View
      className='mb-3 mt-6 flex-row items-center justify-center gap-2'
      entering={anim(delay)}
    >
      <View className='h-px flex-1' style={{ backgroundColor: borderColor }} />
      <Text
        className='text-[13px] font-semibold tracking-wider'
        style={{ color: textColor }}
      >
        {text}
      </Text>
      <View className='h-px flex-1' style={{ backgroundColor: borderColor }} />
    </Animated.View>
  );
}

export function HabitDetailContent({
  habit,
  completedDates,
  notesByDate,
  onDayPress,
}: HabitDetailContentProps) {
  const { colors, isDark } = useThemeColors();
  const cardBg = isDark ? colors.card : '#FFFFFF';
  const shadowColor = isDark ? '#000000' : '#1c1917';
  const borderColor = isDark ? colors.border : '#DDD8D2';
  const labelColor = isDark ? colors.text.tertiary : '#9C958D';

  const accentColor = habit.color ?? habit.iconColor ?? colors.primary[600] ?? '#059669';

  const handleRepairGap = useCallback(
    (missedDate: string) => {
      // Trigger the same flow as tapping a missed day on the calendar
      const isCompleted = completedDates.has(missedDate);
      onDayPress(missedDate, isCompleted);
    },
    [completedDates, onDayPress],
  );

  return (
    <ScrollView
      bounces
      className='flex-1'
      contentContainerClassName='pb-8 px-4'
      showsVerticalScrollIndicator={false}
    >
      {/* ──────────── CHAIN section ──────────── */}
      <SectionLabel
        borderColor={borderColor}
        delay={120}
        text='CHAIN'
        textColor={labelColor}
      />
      <Animated.View entering={anim(160)}>
        <ErrorBoundary>
          <ChainVisualizationBanner
            accentColor={accentColor}
            completedDates={completedDates}
            habitCreatedAt={habit.createdAt}
            habitName={habit.name}
            onRepairGap={handleRepairGap}
          />
        </ErrorBoundary>
      </Animated.View>

      {/* ──────────── STRENGTH section ──────────── */}
      {habit.createdAt && (
        <>
          <SectionLabel borderColor={borderColor} delay={240} text='STRENGTH' textColor={labelColor} />
          <Animated.View
            className='rounded-2xl'
            entering={anim(300)}
            style={{
              backgroundColor: cardBg,
              elevation: 4,
              shadowColor,
              shadowOffset: { height: 4, width: 0 },
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 16,
            }}
          >
            <ErrorBoundary>
              <HabitStrengthSection
                completedDates={completedDates}
                habitColor={accentColor}
                habitCreatedAt={habit.createdAt}
                habitId={habit._id}
                habitStrength={habit.strength}
              />
            </ErrorBoundary>
          </Animated.View>
        </>
      )}

      {/* ──────────── HISTORY section ──────────── */}
      <SectionLabel borderColor={borderColor} delay={360} text='HISTORY' textColor={labelColor} />
      <Animated.View
        className='rounded-2xl p-4'
        entering={anim(420)}
        style={{
          backgroundColor: cardBg,
          elevation: 4,
          shadowColor,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
        }}
      >
        <ErrorBoundary>
          <MonthlyCalendarGrid
            completedDates={completedDates}
            habitColor={accentColor}
            habitCreatedAt={habit.createdAt}
            habitId={habit._id}
            notesByDate={notesByDate}
            onDayPress={onDayPress}
          />
        </ErrorBoundary>
      </Animated.View>
    </ScrollView>
  );
}
