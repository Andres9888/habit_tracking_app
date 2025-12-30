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

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

import { getStrengthColors, getStrengthLabel } from './strengthUtils';
import type { StrengthColors, StrengthLabel } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Animation constants
const RING_ANIMATION_DURATION = 1000;
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

  useEffect(() => {
    if (shouldReduceMotion) {
      progress.value = strength / 100;
      return;
    }

    // Animate from 0 to the target strength
    progress.value = withTiming(strength / 100, {
      duration: RING_ANIMATION_DURATION,
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
      entering={FadeIn.delay(animationDelay).duration(400)}
      className={`flex-1 items-center rounded-xl p-3 ${
        isHighlighted
          ? 'border-2 border-emerald-200 bg-white shadow-sm'
          : 'bg-stone-50'
      }`}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={`${timeLabel}: ${Math.round(strength)}% strength, ${labelText}`}
    >
      {/* Circular Progress Ring */}
      <View
        className="relative mb-2"
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(strength) }}
      >
        <Svg width={RING_SIZE} height={RING_SIZE}>
          {/* Background circle (gray track) */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#e7e5e4" // stone-200
            strokeWidth={RING_STROKE_WIDTH}
          />

          {/* Animated progress circle */}
          <AnimatedCircle
            animatedProps={animatedProps}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={colors.ring}
            strokeWidth={RING_STROKE_WIDTH}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        </Svg>

        {/* Percentage text in center */}
        <View className="absolute inset-0 items-center justify-center">
          <Text
            className="text-sm font-bold"
            style={{ color: colors.primary }}
          >
            {Math.round(strength)}%
          </Text>
        </View>
      </View>

      {/* Time label */}
      <Text className="mb-0.5 text-xs font-medium uppercase tracking-wide text-stone-500">
        {timeLabel}
      </Text>

      {/* Strength label */}
      <Text
        className="text-xs font-semibold capitalize"
        style={{ color: colors.primary }}
      >
        {labelText}
      </Text>

      {/* Delta badge (only for Now card) */}
      {delta !== undefined && <DeltaBadge delta={delta} />}
    </Animated.View>
  );
}

interface DeltaBadgeProps {
  delta: number;
}

/**
 * Badge showing the change in strength vs 30 days ago
 */
function DeltaBadge({ delta }: DeltaBadgeProps) {
  const isPositive = delta > 0;
  const isNegative = delta < 0;
  const isNeutral = delta === 0;

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const iconColor = isPositive ? '#10b981' : isNegative ? '#ef4444' : '#a8a29e';
  const textColor = isPositive
    ? 'text-emerald-600'
    : isNegative
      ? 'text-red-600'
      : 'text-stone-400';
  const bgColor = isPositive
    ? 'bg-emerald-50'
    : isNegative
      ? 'bg-red-50'
      : 'bg-stone-100';

  return (
    <View
      className={`mt-1.5 flex-row items-center gap-0.5 rounded-full px-2 py-0.5 ${bgColor}`}
      accessible={true}
      accessibilityLabel={`${isPositive ? 'Up' : isNegative ? 'Down' : 'No change'} ${Math.abs(delta)}% vs last month`}
    >
      <Icon size={10} color={iconColor} />
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
    case 'weak':
      return 'Weak';
    case 'developing':
      return 'Developing';
    case 'strong':
      return 'Strong';
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
}: StrengthComparisonCardsProps) {
  // Determine labels for past timeframes based on habit age
  const thirtyDaysLabel = habitAgeDays >= 30 ? '30 Days' : 'Start';
  const oneYearLabel = habitAgeDays >= 365 ? '1 Year' : 'Start';

  // Use start strength (0) if habit is too young for the timeframe
  const thirtyDaysStrength = thirtyDaysAgo ?? 0;
  const oneYearStrength = oneYearAgo ?? 0;

  return (
    <View
      className="flex-row gap-2"
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Habit strength comparison across timeframes"
    >
      {/* Now Card - Highlighted */}
      <StrengthCard
        strength={current}
        timeLabel="Now"
        isHighlighted={true}
        delta={deltaVsMonth}
        animationDelay={0}
      />

      {/* 30 Days Ago Card */}
      <StrengthCard
        strength={thirtyDaysStrength}
        timeLabel={thirtyDaysLabel}
        animationDelay={100}
      />

      {/* 1 Year Ago Card */}
      <StrengthCard
        strength={oneYearStrength}
        timeLabel={oneYearLabel}
        animationDelay={200}
      />
    </View>
  );
}

export default StrengthComparisonCards;
