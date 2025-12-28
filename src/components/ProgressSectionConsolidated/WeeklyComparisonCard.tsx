/**
 * WeeklyComparisonCard Component
 *
 * Displays a comparison between this week's completions and last week's.
 * Provides a quick visual indicator of momentum with completion bars
 * and trend indicators.
 *
 * Features:
 * - Side-by-side week comparison
 * - Visual completion bars for each day
 * - Trend indicator (improving/stable/declining)
 * - Animated entrance and counters
 * - Full accessibility support
 *
 * @see docs/specs/habit-details-screen/progress/progress-section-tasks.md
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react-native';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { Springs } from '../../constants/motion';
import { calculateWeeklyComparison } from '../ProgressSection/utils';
import type {
  WeeklyComparisonCardProps,
  WeekDayData,
} from './WeeklyComparisonCardTypes';
import {
  getComparisonStatus,
  WEEKLY_CARD_ANIMATION,
  WEEKLY_CARD_STYLES,
} from './WeeklyComparisonCardTypes';

/**
 * Week Bar Visualization Component
 * Renders a row of bars representing each day's completion status
 */
const WeekBars = React.memo(function WeekBars({
  days,
  label,
  completedCount,
  totalCount,
  statusColor,
  reduceMotion,
  delayOffset = 0,
}: {
  days: WeekDayData[];
  label: string;
  completedCount: number;
  totalCount: number;
  statusColor: string;
  reduceMotion: boolean;
  delayOffset?: number;
}) {
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }

    progress.value = withDelay(
      delayOffset,
      withTiming(1, {
        duration: WEEKLY_CARD_ANIMATION.barRevealDuration * 7,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [reduceMotion, progress, delayOffset]);

  return (
    <View
      accessibilityLabel={`${label}: ${completedCount} of ${totalCount} days completed`}
      className='flex-1'
    >
      <Text className='mb-1 text-xs font-medium text-stone-500'>{label}</Text>
      <View
        className='flex-row items-end justify-between'
        style={{ height: 44 }}
      >
        {days.map((day, i) => (
          <DayBar
            key={day.date}
            day={day}
            index={i}
            progress={progress}
            reduceMotion={reduceMotion}
            statusColor={statusColor}
          />
        ))}
      </View>
      <Text className='mt-1 text-center text-sm font-semibold text-stone-700'>
        {completedCount}/{totalCount}
      </Text>
    </View>
  );
});

/**
 * Individual day bar with reveal animation
 */
const DayBar = React.memo(function DayBar({
  day,
  index,
  progress,
  statusColor,
  reduceMotion,
}: {
  day: WeekDayData;
  index: number;
  progress: Animated.SharedValue<number>;
  statusColor: string;
  reduceMotion: boolean;
}) {
  const barStyle = useAnimatedStyle(() => {
    // Stagger reveal from left to right
    const staggeredProgress = interpolate(
      progress.value,
      [index / 7, Math.min(1, (index + 2) / 7)],
      [0, 1],
      'clamp'
    );

    return {
      opacity: reduceMotion ? 1 : staggeredProgress,
      transform: [
        {
          scaleY: reduceMotion ? 1 : staggeredProgress,
        },
      ],
    };
  });

  // Determine bar appearance based on day status
  let backgroundColor = '#e7e5e4'; // stone-200 - default for incomplete
  let height = WEEKLY_CARD_STYLES.barMaxHeight * 0.3; // Minimum height for visibility

  if (day.isFuture || day.isBeforeCreation) {
    // Inactive days get a faded appearance
    backgroundColor = '#f5f5f4'; // stone-100
    height = WEEKLY_CARD_STYLES.barMaxHeight * 0.2;
  } else if (day.completed) {
    backgroundColor = statusColor;
    height = WEEKLY_CARD_STYLES.barMaxHeight;
  }

  return (
    <View className='items-center'>
      <Animated.View
        style={[
          barStyle,
          {
            backgroundColor,
            borderRadius: 4,
            height,
            transformOrigin: 'bottom',
            width: WEEKLY_CARD_STYLES.barWidth,
          },
        ]}
      />
      <Text className='mt-1 text-[10px] text-stone-400'>
        {day.dayLabel.charAt(0)}
      </Text>
    </View>
  );
});

/**
 * WeeklyComparisonCard - Main component
 * Memoized to prevent unnecessary re-renders
 */
export const WeeklyComparisonCard = React.memo(function WeeklyComparisonCard({
  tracking,
  habitCreatedAt,
  index = 0,
}: WeeklyComparisonCardProps) {
  const reduceMotion = useReduceMotion();

  // Calculate comparison data
  const comparisonData = useMemo(() => {
    const createdTimestamp = habitCreatedAt
      ? new Date(habitCreatedAt).getTime()
      : undefined;
    return calculateWeeklyComparison(tracking, createdTimestamp);
  }, [tracking, habitCreatedAt]);

  const {
    thisWeekCompleted,
    thisWeekTotal,
    lastWeekCompleted,
    lastWeekTotal,
    difference,
    trend,
    thisWeekDays,
    lastWeekDays,
  } = comparisonData;

  const status = getComparisonStatus(difference, lastWeekTotal);

  // Entrance animation values
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const scale = useSharedValue(reduceMotion ? 1 : 0.95);

  // Run entrance animation
  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }

    const delay = index * WEEKLY_CARD_ANIMATION.staggerDelay;

    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: WEEKLY_CARD_ANIMATION.entranceDuration,
        easing: Easing.out(Easing.cubic),
      })
    );

    scale.value = withDelay(delay, withSpring(1, Springs.gentle));
  }, [index, reduceMotion, opacity, scale]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Render trend indicator
  const renderTrendIndicator = () => {
    if (lastWeekTotal === 0) {
      // New habit, no comparison possible
      return null;
    }

    if (trend === 'stable') {
      return (
        <View
          accessibilityLabel='Same as last week'
          className='flex-row items-center rounded-full bg-stone-100 px-2 py-0.5'
        >
          <Minus className='text-stone-500' size={12} />
          <Text className='ml-1 text-xs font-medium text-stone-500'>Same</Text>
        </View>
      );
    }

    const isUp = trend === 'up';
    const Icon = isUp ? TrendingUp : TrendingDown;
    const colorClass = isUp ? 'text-emerald-600' : 'text-amber-600';
    const bgClass = isUp ? 'bg-emerald-50' : 'bg-amber-50';

    return (
      <View
        accessibilityLabel={`${isUp ? 'Up' : 'Down'} ${Math.abs(difference)} from last week`}
        className={`flex-row items-center rounded-full px-2 py-0.5 ${bgClass}`}
      >
        <Icon className={colorClass} size={12} />
        <Text className={`ml-1 text-xs font-medium ${colorClass}`}>
          {isUp ? '+' : ''}
          {difference}
        </Text>
      </View>
    );
  };

  // Accessibility label
  const accessibilityLabel = `Weekly comparison: This week ${thisWeekCompleted} of ${thisWeekTotal} completed, last week ${lastWeekCompleted} of ${lastWeekTotal}. ${
    lastWeekTotal > 0
      ? difference > 0
        ? `Up ${difference} from last week.`
        : difference < 0
          ? `Down ${Math.abs(difference)} from last week.`
          : 'Same as last week.'
      : 'No previous week data.'
  } ${status.description}.`;

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='summary'
      className='mb-3 rounded-2xl p-4'
      style={[containerStyle, { backgroundColor: status.bgColor }]}
    >
      {/* Header row */}
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <Calendar color={status.color} size={18} />
          <Text className='ml-2 text-sm font-semibold text-stone-700'>
            Weekly Progress
          </Text>
        </View>
        {renderTrendIndicator()}
      </View>

      {/* Status row */}
      <View className='mt-2 flex-row items-center'>
        <Text className='text-base'>{status.emoji}</Text>
        <Text
          className='ml-1 text-sm font-medium'
          style={{ color: status.color }}
        >
          {status.label}
        </Text>
        <Text className='ml-2 text-xs text-stone-500'>
          {status.description}
        </Text>
      </View>

      {/* Comparison bars */}
      <View className='mt-4 flex-row gap-6'>
        <WeekBars
          completedCount={lastWeekCompleted}
          days={lastWeekDays}
          delayOffset={100}
          label='Last Week'
          reduceMotion={reduceMotion}
          statusColor='#a8a29e' // stone-400
          totalCount={lastWeekTotal}
        />
        <WeekBars
          completedCount={thisWeekCompleted}
          days={thisWeekDays}
          delayOffset={200}
          label='This Week'
          reduceMotion={reduceMotion}
          statusColor={status.color}
          totalCount={thisWeekTotal}
        />
      </View>
    </Animated.View>
  );
});

export default WeeklyComparisonCard;
