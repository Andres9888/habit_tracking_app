/**
 * HabitStrengthHistory Component
 *
 * Main container that composes all Habit Strength History sub-components.
 * Displays habit strength evolution using exponential smoothing algorithm.
 *
 * @see habit-strength-history-spec.md for design details
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';
import { Info } from 'lucide-react-native';

import { useHabitStrength } from '../../hooks/useHabitStrength';

import { HabitStrengthHistorySkeleton } from './HabitStrengthHistorySkeleton';
import { StrengthComparisonCards } from './StrengthComparisonCards';
import { StrengthTimelineChart } from './StrengthTimelineChart';
import { StrengthInsightsRow } from './StrengthInsightsRow';
import type { HabitStrengthHistoryProps } from './types';

// Animation constants
const SECTION_FADE_DURATION = 400;
const SECTION_SLIDE_DURATION = 400;
const SECTION_SLIDE_DELAY = 200;

// Placeholder for info button handler - can be extended to show modal
const handleInfoPress = () => {
  // TODO: Show info modal explaining habit strength calculation
};

interface SectionHeaderProps {
  title: string;
  onInfoPress?: () => void;
}

/**
 * Section header with title and info icon button
 */
function SectionHeader({ title, onInfoPress }: SectionHeaderProps) {
  return (
    <View className='flex-row items-center justify-between'>
      <Text className='text-base font-semibold text-stone-700'>{title}</Text>
      <Pressable
        accessible
        accessibilityLabel='Learn more about habit strength'
        accessibilityRole='button'
        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
        testID='strength-history-info-button'
        onPress={onInfoPress}
      >
        <Info color='#78716c' size={18} />
      </Pressable>
    </View>
  );
}

/**
 * HabitStrengthHistory - Main container component
 *
 * Composes all sub-components and manages data flow via useHabitStrength hook.
 */
export function HabitStrengthHistory({
  habitId: _habitId,
  completedDates,
  habitCreatedAt,
  habitColor,
}: HabitStrengthHistoryProps) {
  const shouldReduceMotion = useReducedMotion();

  const { currentStrength, strengthHistory, metrics, isCalculating } =
    useHabitStrength(completedDates, habitCreatedAt);

  if (isCalculating) {
    return (
      <HabitStrengthHistorySkeleton
        reduceMotion={shouldReduceMotion ?? false}
      />
    );
  }

  const slideUpEntering = shouldReduceMotion
    ? FadeIn.duration(SECTION_FADE_DURATION)
    : FadeInUp.duration(SECTION_SLIDE_DURATION).delay(SECTION_SLIDE_DELAY);

  return (
    <Animated.View
      accessible
      accessibilityLabel='Habit strength history section'
      accessibilityRole='none'
      className='gap-4'
      entering={slideUpEntering}
      testID='habit-strength-history'
    >
      <SectionHeader title='Strength History' onInfoPress={handleInfoPress} />

      <StrengthComparisonCards
        current={currentStrength}
        deltaVsMonth={metrics.deltaVsMonth}
        habitAgeDays={metrics.habitAgeDays}
        oneYearAgo={metrics.oneYearAgo}
        thirtyDaysAgo={metrics.thirtyDaysAgo}
      />

      <StrengthTimelineChart
        habitColor={habitColor}
        strengthHistory={strengthHistory}
      />

      <StrengthInsightsRow
        deltaVsMonth={metrics.deltaVsMonth}
        lowest={metrics.lowest}
        peak={metrics.peak}
      />
    </Animated.View>
  );
}

export default HabitStrengthHistory;
