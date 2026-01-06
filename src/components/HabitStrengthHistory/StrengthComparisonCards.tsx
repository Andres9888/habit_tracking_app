/**
 * StrengthComparisonCards Component
 *
 * Displays three cards showing habit strength at key timeframes:
 * - Now (current strength with delta badge)
 * - 30 Days Ago (or "Start" if habit is younger)
 * - 1 Year Ago (or "Start" if habit is younger)
 *
 * Each card features:
 * - Animated circular progress ring
 * - Strength percentage
 * - Strength label (Weak/Developing/Strong)
 * - Color coding based on strength level
 */

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  FadeIn,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react-native';

import {
  getStrengthColors,
  getStrengthLabel,
  isPerfectStreak,
} from './strengthUtils';
import type { StrengthColors, StrengthLabel } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Animation constants
const RING_ANIMATION_DURATION = 1000;
const NUMBER_COUNT_UP_DURATION = 800;
const RING_SIZE = 56;
const RING_STROKE_WIDTH = 4;

export interface StrengthComparisonCardsProps {
  /** Current strength percentage (0-100) */
  current: number;
  /** Strength 30 days ago, or null if habit is younger than 30 days */
  thirtyDaysAgo: number | null;
  /** Strength 1 year ago, or null if habit is younger than 1 year */
  oneYearAgo: number | null;
  /** Change in strength vs 30 days ago */
  deltaVsMonth: number;
  /** Number of days since habit was created */
  habitAgeDays: number;
  /** Set of completed dates for calculating completion rate */
  completedDates?: Set<string>;
}

interface StrengthCardProps {
  /** Strength percentage (0-100) */
  strength: number;
  /** Label to display below the percentage */
  timeLabel: string;
  /** Whether this is the highlighted "Now" card */
  isHighlighted?: boolean;
  /** Delta value to show (only for "Now" card) */
  delta?: number;
  /** Animation delay in ms */
  animationDelay?: number;
  /** Whether to show the "Perfect!" celebration badge */
  showPerfectBadge?: boolean;
}

/**
 * Individual strength card with circular progress ring
 */
function StrengthCard({
  strength,
  timeLabel,
  isHighlighted = false,
  delta,
  animationDelay = 0,
  showPerfectBadge = false,
}: StrengthCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const colors = getStrengthColors(strength);
  const label = getStrengthLabel(strength);

  // Calculate ring geometry
  const radius = (RING_SIZE - RING_STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = RING_SIZE / 2;

  // Animated progress value (0 to strength/100)
  const progress = useSharedValue(0);

  // State for displaying the animated number count
  const [displayedValue, setDisplayedValue] = useState(
    shouldReduceMotion ? Math.round(strength) : 0
  );

  // Update displayed value using animated reaction (count-up effect)
  useAnimatedReaction(
    () => progress.value,
    (currentProgress) => {
      const currentValue = Math.round(currentProgress * 100);
      runOnJS(setDisplayedValue)(currentValue);
    },
    [progress]
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      progress.value = strength / 100;
      setDisplayedValue(Math.round(strength));
      return;
    }

    // Animate from 0 to the target strength (controls both ring and number)
    progress.value = withTiming(strength / 100, {
      duration: NUMBER_COUNT_UP_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [strength, progress, shouldReduceMotion]);

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const labelText = getLabelText(label);

  return (
    <Animated.View
      accessible
      accessibilityLabel={`${timeLabel}: ${Math.round(strength)}% strength, ${labelText}`}
      accessibilityRole='none'
      className={`flex-1 items-center rounded-xl p-3 ${
        isHighlighted
          ? 'border-2 border-emerald-200 bg-white shadow-sm'
          : 'bg-stone-50'
      }`}
      entering={FadeIn.delay(animationDelay).duration(400)}
    >
      {/* Circular Progress Ring */}
      <View
        accessible
        accessibilityRole='progressbar'
        accessibilityValue={{ max: 100, min: 0, now: Math.round(strength) }}
        className='relative mb-2'
      >
        <Svg height={RING_SIZE} width={RING_SIZE}>
          {/* Background circle (gray track) */}
          <Circle
            cx={center}
            cy={center}
            fill='none'
            r={radius}
            stroke='#e7e5e4' // stone-200
            strokeWidth={RING_STROKE_WIDTH}
          />

          {/* Animated progress circle */}
          <AnimatedCircle
            animatedProps={animatedProps}
            cx={center}
            cy={center}
            fill='none'
            origin={`${center}, ${center}`}
            r={radius}
            rotation='-90'
            stroke={colors.ring}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap='round'
            strokeWidth={RING_STROKE_WIDTH}
          />
        </Svg>

        {/* Percentage text in center - animates from 0 to final value */}
        <View className='absolute inset-0 items-center justify-center'>
          <Text
            className='text-sm font-bold'
            style={{ color: colors.primary }}
            testID={`strength-value-${timeLabel.toLowerCase().replaceAll(/\s+/g, '-')}`}
          >
            {displayedValue}%
          </Text>
        </View>
      </View>

      {/* Time label */}
      <Text className='mb-0.5 text-xs font-medium uppercase tracking-wide text-stone-500'>
        {timeLabel}
      </Text>

      {/* Strength label */}
      <Text
        className='text-xs font-semibold capitalize'
        style={{ color: colors.primary }}
      >
        {labelText}
      </Text>

      {/* Delta badge (only for Now card) */}
      {delta !== undefined && <DeltaBadge delta={delta} />}

      {/* Perfect badge (only for Now card with 100% completion) */}
      {showPerfectBadge && <PerfectBadge />}
    </Animated.View>
  );
}

/**
 * Celebration badge shown when user has 100% completion rate
 */
function PerfectBadge() {
  return (
    <View
      accessible
      accessibilityLabel='Perfect streak! You have completed every day since starting this habit'
      className='mt-1.5 flex-row items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5'
      testID='perfect-badge'
    >
      <Sparkles color='#d97706' size={10} />
      <Text className='text-[10px] font-bold text-amber-700'>Perfect!</Text>
    </View>
  );
}

interface DeltaBadgeProps {
  delta: number;
}

// WCAG AA compliant colors (4.5:1 minimum contrast ratio)
const DELTA_BADGE_COLORS = {
  // Emerald-700 (WCAG AA: 5.48:1)
  negative: '#dc2626',
  // Red-600 (WCAG AA: 4.83:1)
  neutral: '#78716c',
  positive: '#047857', // Stone-500 (WCAG AA: 4.80:1)
} as const;

/**
 * Badge showing the change in strength vs 30 days ago
 */
function DeltaBadge({ delta }: DeltaBadgeProps) {
  const isPositive = delta > 0;
  const isNegative = delta < 0;
  const isNeutral = delta === 0;

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const iconColor = isPositive
    ? DELTA_BADGE_COLORS.positive
    : isNegative
      ? DELTA_BADGE_COLORS.negative
      : DELTA_BADGE_COLORS.neutral;
  // Text colors using WCAG AA compliant shades (-700 variants)
  const textColor = isPositive
    ? 'text-emerald-700'
    : isNegative
      ? 'text-red-700'
      : 'text-stone-500';
  const bgColor = isPositive
    ? 'bg-emerald-50'
    : isNegative
      ? 'bg-red-50'
      : 'bg-stone-100';

  return (
    <View
      accessible
      accessibilityLabel={`${isPositive ? 'Up' : isNegative ? 'Down' : 'No change'} ${Math.abs(delta)}% vs last month`}
      className={`mt-1.5 flex-row items-center gap-0.5 rounded-full px-2 py-0.5 ${bgColor}`}
    >
      <Icon color={iconColor} size={10} />
      <Text className={`text-[10px] font-semibold ${textColor}`}>
        {isPositive ? '+' : ''}
        {delta.toFixed(1)}%
      </Text>
    </View>
  );
}

/**
 * Convert strength label to display text
 */
function getLabelText(label: StrengthLabel): string {
  switch (label) {
    case 'weak': {
      return 'Weak';
    }
    case 'developing': {
      return 'Developing';
    }
    case 'strong': {
      return 'Strong';
    }
  }
}

/**
 * StrengthComparisonCards - Three-card comparison layout
 */
export function StrengthComparisonCards({
  current,
  thirtyDaysAgo,
  oneYearAgo,
  deltaVsMonth,
  habitAgeDays,
  completedDates,
}: StrengthComparisonCardsProps) {
  // Determine labels for past timeframes based on habit age
  const thirtyDaysLabel = habitAgeDays >= 30 ? '30 Days' : 'Start';
  const oneYearLabel = habitAgeDays >= 365 ? '1 Year' : 'Start';

  // Use start strength (0) if habit is too young for the timeframe
  const thirtyDaysStrength = thirtyDaysAgo ?? 0;
  const oneYearStrength = oneYearAgo ?? 0;

  // Check for perfect completion streak
  const showPerfect = completedDates
    ? isPerfectStreak(completedDates, habitAgeDays)
    : false;

  return (
    <View
      accessible
      accessibilityLabel='Habit strength comparison across timeframes'
      accessibilityRole='none'
      className='flex-row gap-2'
    >
      {/* Now Card - Highlighted */}
      <StrengthCard
        isHighlighted
        animationDelay={0}
        delta={deltaVsMonth}
        showPerfectBadge={showPerfect}
        strength={current}
        timeLabel='Now'
      />

      {/* 30 Days Ago Card */}
      <StrengthCard
        animationDelay={100}
        strength={thirtyDaysStrength}
        timeLabel={thirtyDaysLabel}
      />

      {/* 1 Year Ago Card */}
      <StrengthCard
        animationDelay={200}
        strength={oneYearStrength}
        timeLabel={oneYearLabel}
      />
    </View>
  );
}

export default StrengthComparisonCards;
