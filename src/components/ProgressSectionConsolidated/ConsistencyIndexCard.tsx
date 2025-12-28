/**
 * ConsistencyIndexCard Component
 *
 * Displays a rolling 30-day consistency score with sparkline visualization.
 * The consistency index provides a nuanced view of habit health by combining:
 * - Completion rate (60% weight)
 * - Streak quality (25% weight)
 * - Recent activity (15% weight)
 *
 * Features:
 * - Animated score counter
 * - Mini sparkline showing trend
 * - Period-over-period comparison
 * - Level-based color coding
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
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react-native';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { Springs } from '../../constants/motion';
import { calculateConsistencyIndex } from '../ProgressSection/utils';
import type { ConsistencyIndexCardProps } from './ConsistencyIndexCardTypes';
import {
  getConsistencyLevel,
  CONSISTENCY_CARD_ANIMATION,
} from './ConsistencyIndexCardTypes';

/**
 * Mini Sparkline Component
 * Renders a compact visualization of the last 30 days
 */
const MiniSparkline = React.memo(function MiniSparkline({
  data,
  levelColor,
  reduceMotion,
}: {
  data: Array<{ date: string; completed: boolean; value: number }>;
  levelColor: string;
  reduceMotion: boolean;
}) {
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }

    progress.value = withDelay(
      200,
      withTiming(1, {
        duration: CONSISTENCY_CARD_ANIMATION.sparklineRevealDuration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [reduceMotion, progress]);

  // Calculate min and max for normalization
  const { min, max } = useMemo(() => {
    const values = data.map((d) => d.value);
    return {
      min: Math.min(...values, 0),
      max: Math.max(...values, 100),
    };
  }, [data]);

  const range = max - min || 1;

  return (
    <View
      accessibilityElementsHidden
      className='mt-2 flex-row items-end justify-between'
      style={{ height: 32 }}
    >
      {data.slice(-30).map((point, i) => {
        const normalizedHeight = ((point.value - min) / range) * 100;
        const barHeight = Math.max(4, (normalizedHeight / 100) * 28);

        return (
          <SparklineBar
            key={point.date}
            completed={point.completed}
            height={barHeight}
            index={i}
            levelColor={levelColor}
            progress={progress}
            reduceMotion={reduceMotion}
          />
        );
      })}
    </View>
  );
});

/**
 * Individual sparkline bar with reveal animation
 */
const SparklineBar = React.memo(function SparklineBar({
  height,
  completed,
  levelColor,
  index,
  progress,
  reduceMotion,
}: {
  height: number;
  completed: boolean;
  levelColor: string;
  index: number;
  progress: Animated.SharedValue<number>;
  reduceMotion: boolean;
}) {
  const barStyle = useAnimatedStyle(() => {
    // Stagger reveal from left to right
    const staggeredProgress = interpolate(
      progress.value,
      [index / 30, Math.min(1, (index + 5) / 30)],
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

  return (
    <Animated.View
      style={[
        barStyle,
        {
          width: 4,
          height,
          borderRadius: 2,
          backgroundColor: completed ? levelColor : '#e7e5e4', // stone-200
          transformOrigin: 'bottom',
        },
      ]}
    />
  );
});

/**
 * ConsistencyIndexCard - Main component
 * Memoized to prevent unnecessary re-renders
 */
export const ConsistencyIndexCard = React.memo(function ConsistencyIndexCard({
  tracking,
  habitCreatedAt,
  index = 0,
}: ConsistencyIndexCardProps) {
  const reduceMotion = useReduceMotion();

  // Calculate consistency data
  const consistencyData = useMemo(() => {
    const createdTimestamp = habitCreatedAt
      ? new Date(habitCreatedAt).getTime()
      : undefined;
    return calculateConsistencyIndex(tracking, createdTimestamp);
  }, [tracking, habitCreatedAt]);

  const { score, change, sparklineData, daysIncluded } = consistencyData;
  const level = getConsistencyLevel(score);

  // Entrance animation values
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const scale = useSharedValue(reduceMotion ? 1 : 0.95);
  const scoreValue = useSharedValue(reduceMotion ? score : 0);

  // Run entrance animation
  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      scale.value = 1;
      scoreValue.value = score;
      return;
    }

    const delay = index * CONSISTENCY_CARD_ANIMATION.staggerDelay;

    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: CONSISTENCY_CARD_ANIMATION.entranceDuration,
        easing: Easing.out(Easing.cubic),
      })
    );

    scale.value = withDelay(delay, withSpring(1, Springs.gentle));

    // Animate score counter
    scoreValue.value = withDelay(
      delay + 150,
      withTiming(score, {
        duration: CONSISTENCY_CARD_ANIMATION.scoreCounterDuration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [index, score, reduceMotion, opacity, scale, scoreValue]);

  // Update score when it changes
  useEffect(() => {
    if (reduceMotion) {
      scoreValue.value = score;
    } else {
      scoreValue.value = withTiming(score, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [score, reduceMotion, scoreValue]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Render trend indicator
  const renderTrendIndicator = () => {
    if (change === 0) {
      return (
        <View
          accessibilityLabel='Stable from previous period'
          className='flex-row items-center rounded-full bg-stone-100 px-2 py-0.5'
        >
          <Minus className='text-stone-500' size={12} />
          <Text className='ml-1 text-xs font-medium text-stone-500'>Stable</Text>
        </View>
      );
    }

    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-emerald-600' : 'text-red-600';
    const bgClass = isPositive ? 'bg-emerald-50' : 'bg-red-50';

    return (
      <View
        accessibilityLabel={`${isPositive ? 'Up' : 'Down'} ${Math.abs(change)} points from previous period`}
        className={`flex-row items-center rounded-full px-2 py-0.5 ${bgClass}`}
      >
        <Icon className={colorClass} size={12} />
        <Text className={`ml-1 text-xs font-medium ${colorClass}`}>
          {isPositive ? '+' : ''}
          {change}
        </Text>
      </View>
    );
  };

  // Accessibility label
  const accessibilityLabel = `Consistency index: ${score} percent, ${level.label} level${
    change !== 0
      ? `, ${change > 0 ? 'up' : 'down'} ${Math.abs(change)} points from last period`
      : ', stable from last period'
  }. Based on last ${daysIncluded} days.`;

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='summary'
      className='mb-3 rounded-2xl p-4'
      style={[containerStyle, { backgroundColor: level.bgColor }]}
    >
      {/* Header row */}
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center'>
          <Activity color={level.color} size={18} />
          <Text className='ml-2 text-sm font-semibold text-stone-700'>
            Consistency Index
          </Text>
        </View>
        {renderTrendIndicator()}
      </View>

      {/* Score and level row */}
      <View className='mt-3 flex-row items-baseline'>
        <Text
          className='text-3xl font-bold'
          style={{ color: level.color }}
        >
          {score}
        </Text>
        <Text className='ml-1 text-lg text-stone-500'>%</Text>
        <View className='ml-3 flex-row items-center'>
          <Text className='text-base'>{level.emoji}</Text>
          <Text className='ml-1 text-sm font-medium text-stone-600'>
            {level.label}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text className='mt-1 text-xs text-stone-500'>
        {level.description} • Last {daysIncluded} days
      </Text>

      {/* Sparkline */}
      <MiniSparkline
        data={sparklineData}
        levelColor={level.color}
        reduceMotion={reduceMotion}
      />
    </Animated.View>
  );
});

export default ConsistencyIndexCard;
