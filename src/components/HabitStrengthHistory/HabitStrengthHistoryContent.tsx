/**
 * HabitStrengthHistoryContent Component
 *
 * Renders the main content when habit has completed dates.
 */

import React from 'react';
import Animated, {
  FadeIn,
  FadeInUp,
  useReducedMotion,
} from 'react-native-reanimated';

import { SectionHeader } from './SectionHeader';
import { StrengthComparisonCards } from './StrengthComparisonCards';
import { StrengthTimelineChart } from './StrengthTimelineChart';
import { StrengthInsightsRow } from './StrengthInsightsRow';
import type { StrengthMetrics, StrengthHistoryEntry } from './types';

const SECTION_FADE_DURATION = 400;
const SECTION_SLIDE_DURATION = 400;
const SECTION_SLIDE_DELAY = 200;

interface Props {
  completedDates: Set<string>;
  currentStrength: number;
  metrics: StrengthMetrics;
  strengthHistory: StrengthHistoryEntry[];
  habitColor?: string;
  onInfoPress: () => void;
}

export function HabitStrengthHistoryContent({
  completedDates,
  currentStrength,
  metrics,
  strengthHistory,
  habitColor,
  onInfoPress,
}: Props) {
  const shouldReduceMotion = useReducedMotion();

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
      <SectionHeader title='Strength History' onInfoPress={onInfoPress} />
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

export default HabitStrengthHistoryContent;
