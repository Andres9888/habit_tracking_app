/**
 * HabitStrengthSection Component (Redesigned)
 *
 * Comprehensive habit strength display combining:
 * - Time range switcher (1M/1Y/All)
 * - Circular progress ring with animated fill
 * - Full-width timeline chart with bezier curves
 * - Comparison stats row
 */

import React from 'react';
import { View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { durations } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import { colors as palette } from '@/theme/colors';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { shadows } from '../../theme/spacing';
import { StrengthProgressBar } from '../StrengthProgressBar';
import { useHabitStrengthData } from './HabitStrengthSection.hooks';
import { getStrengthJourney } from './journey';
import { MilestoneTrack } from './MilestoneTrack';
import { SectionHeader } from './SectionHeader';
import { StrengthChart } from './StrengthChart';
import { StrengthEmptyState } from './StrengthEmptyState';
import { StrengthHero } from './StrengthHero';
import { StrengthSkeleton } from './StrengthSkeleton';
import { StrengthStatsRow } from './StrengthStatsRow';
import { TrendMessage } from './TrendMessage';
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
    extendedMetrics,
    isCalculating,
    isEmpty,
    setTimeRange,
    timeRange,
  } = useHabitStrengthData({ completedDates, habitCreatedAt, habitStrength });

  // The journey reads as level progression, so the ring + chart follow the
  // current level's color (shown across StrengthProgressBar and HabitCard too).
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
        ...shadows.card,
        // Warm near-white card surface — the same surface the home HabitCard
        // uses (colors.light.surfaceMuted). Keep the theme card token in dark.
        backgroundColor: isDark ? themeColors.card : palette.light.surfaceMuted,
        borderColor: themeColors.border,
        borderWidth: 1,
      }}
    >
      <View className='p-4'>
        <SectionHeader value={timeRange} onChange={setTimeRange} />

        <View className='mb-5'>
          <StrengthHero journey={journey} strength={currentStrength} />
        </View>

        <View className='mb-4'>
          <MilestoneTrack
            currentIndex={journey.index}
            levels={journey.levels}
          />
        </View>

        <View className='mb-5'>
          <StrengthProgressBar
            emojiOverrides={progressEmojis}
            showLabel={false}
            showNextLevel
            showPercentage={false}
            size='large'
            strength={currentStrength}
          />
        </View>

        <View className='-mx-4 mb-3'>
          <StrengthChart
            color={stageColor}
            currentStrength={currentStrength}
            data={chartData}
            timeRange={timeRange}
          />
        </View>

        <TrendMessage delta={extendedMetrics.deltaVsMonth} />

        <StrengthStatsRow
          lastMonth={extendedMetrics.deltaVsMonth}
          lastWeek={extendedMetrics.deltaVsWeek}
          sinceStart={extendedMetrics.sinceStart}
        />
      </View>
    </Animated.View>
  );
});

export default HabitStrengthSection;
