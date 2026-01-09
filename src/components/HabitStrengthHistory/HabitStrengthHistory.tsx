/**
 * HabitStrengthHistory Component
 *
 * Main container that composes all Habit Strength History sub-components.
 * Displays habit strength evolution using exponential smoothing algorithm.
 */

import React from 'react';
import Animated, {
  FadeIn,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';

import { useHabitStrength } from '../../hooks/useHabitStrength';
import { EmptyStrengthState } from './EmptyStrengthState';
import { HabitStrengthHistorySkeleton } from './HabitStrengthHistorySkeleton';
import { SectionHeader } from './SectionHeader';
import { StrengthComparisonCards } from './StrengthComparisonCards';
import { StrengthTimelineChart } from './StrengthTimelineChart';
import { StrengthInsightsRow } from './StrengthInsightsRow';
import type { HabitStrengthHistoryProps } from './types';

const SECTION_FADE_DURATION = 400;
const SECTION_SLIDE_DURATION = 400;
const SECTION_SLIDE_DELAY = 200;

const handleInfoPress = () => {
  // TODO: Show info modal explaining habit strength calculation
};

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

  if (completedDates.size === 0) {
    return (
      <EmptyStrengthState
        habitAgeDays={metrics.habitAgeDays}
        reduceMotion={shouldReduceMotion ?? false}
        onInfoPress={handleInfoPress}
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
        completedDates={completedDates}
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
