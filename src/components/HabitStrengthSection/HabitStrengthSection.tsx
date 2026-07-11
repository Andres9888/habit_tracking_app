/**
 * HabitStrengthSection Component
 *
 * Chart-led habit strength card: kicker + stage badge, timeline chart with
 * bezier curve, and the 5-stop milestone track.
 */

import React from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import { colors as palette } from '@/theme/colors';
import { fontWeights, typography } from '@/theme/typography';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { shadows } from '../../theme/spacing';
import { useHabitStrengthData } from './HabitStrengthSection.hooks';
import { getStrengthJourney } from './journey';
import { MilestoneTrack } from './MilestoneTrack';
import { RangeToggle } from './RangeToggle';
import { StrengthChart } from './StrengthChart';
import { StrengthEmptyState } from './StrengthEmptyState';
import { StrengthSkeleton } from './StrengthSkeleton';
import type { HabitStrengthSectionProps } from './types';

export const HabitStrengthSection = React.memo(function HabitStrengthSection({
  completedDates,
  habitCreatedAt,
  habitStrength,
  progressEmojis,
}: HabitStrengthSectionProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const {
    chartData,
    currentStrength,
    isCalculating,
    isEmpty,
    setTimeRange,
    timeRange,
  } = useHabitStrengthData({ completedDates, habitCreatedAt, habitStrength });

  // The journey reads as level progression, so the chart + milestones follow
  // the current level's color (shown across StrengthProgressBar and HabitCard too).
  const journey = getStrengthJourney(currentStrength, progressEmojis);
  const stageColor = journey.current.color;

  if (isCalculating) return <StrengthSkeleton />;

  if (isEmpty)
    return <StrengthEmptyState startingEmoji={progressEmojis.starting} />;

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl'
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.duration(durations.enter)
              .delay(100)
              .easing(Easing.out(Easing.cubic))
      }
      style={{
        ...shadows.subtle,
        backgroundColor: isDark ? themeColors.card : palette.light.cardElevated,
        borderColor: themeColors.border,
        borderWidth: 1,
      }}
    >
      <View className='p-4'>
        <View className='mb-3 flex-row items-center justify-between'>
          <Text
            style={{
              ...typography.overline,
              color: themeColors.text.secondary,
            }}
          >
            Strength
          </Text>
          <Text
            style={{
              ...typography.caption,
              color: stageColor,
              fontWeight: fontWeights.bold,
            }}
          >
            {journey.current.emoji} {journey.current.label} · {currentStrength}%
          </Text>
        </View>

        <View className='mb-3 flex-row justify-end'>
          <RangeToggle value={timeRange} onChange={setTimeRange} />
        </View>

        <View className='-mx-4 mb-3'>
          <StrengthChart
            color={stageColor}
            currentStrength={currentStrength}
            data={chartData}
            timeRange={timeRange}
          />
        </View>

        <MilestoneTrack currentIndex={journey.index} levels={journey.levels} />
      </View>
    </Animated.View>
  );
});

export default HabitStrengthSection;
