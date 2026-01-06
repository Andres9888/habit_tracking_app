/**
 * StrengthHero Component
 *
 * Displays the current habit strength with:
 * - Circular progress ring (72x72px) with animated fill
 * - Percentage number with count-up animation
 * - Strength label (Strong/Developing/Weak)
 * - Delta badge showing change vs previous period
 *
 * @example
 * ```tsx
 * <StrengthHero
 *   strength={72}
 *   label="strong"
 *   delta={12}
 *   deltaLabel="vs last month"
 * />
 * ```
 */

import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Text, View } from 'react-native';

import { TrendingDown, TrendingUp } from 'lucide-react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import {
  ANIMATION,
  COLORS,
  RING_CIRCUMFERENCE,
  RING_RADIUS,
  RING_SIZE,
  RING_STROKE_WIDTH,
  STRENGTH_COLORS,
  STRENGTH_LABELS,
} from './constants';
import type { StrengthHeroProps } from './types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Animated text component that displays a counting percentage.
 */
function AnimatedPercentage({
  animatedValue,
}: {
  animatedValue: SharedValue<number>;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useDerivedValue(() => {
    // Use bitwise OR to ensure integer (avoids Reanimated precision errors)
    const rounded = (animatedValue.value + 0.5) | 0;
    runOnJS(setDisplayValue)(rounded);
    return rounded;
  });

  return (
    <Text className="text-2xl font-bold text-stone-900">{displayValue}%</Text>
  );
}

/**
 * StrengthHero displays the main strength indicator with animated ring.
 */
export const StrengthHero = React.memo(function StrengthHero({
  strength,
  label,
  delta,
  deltaLabel,
  color,
}: StrengthHeroProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  // Get colors based on strength level
  const colors = STRENGTH_COLORS[label];
  const ringColor = color || colors.primary;

  // Animated values
  const animatedStrength = useSharedValue(0);

  // Check for reduce motion preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Animate ring fill on mount and when strength changes
  // Round to integer to avoid Reanimated precision errors
  const roundedStrength = Math.round(strength);

  useEffect(() => {
    if (reduceMotion) {
      animatedStrength.value = roundedStrength;
    } else {
      animatedStrength.value = withTiming(roundedStrength, {
        duration: ANIMATION.ringDuration,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [roundedStrength, reduceMotion, animatedStrength]);

  // Animated props for the progress circle
  const animatedCircleProps = useAnimatedProps(() => {
    const progress = animatedStrength.value / 100;
    return {
      strokeDashoffset: RING_CIRCUMFERENCE * (1 - progress),
    };
  });

  const center = RING_SIZE / 2;

  // Format delta for display
  const deltaText = delta >= 0 ? `+${delta}%` : `${delta}%`;
  const deltaIsPositive = delta > 0;
  const deltaIsNegative = delta < 0;

  return (
    <View className="flex-row items-center">
      {/* Progress Ring */}
      <View
        style={{ width: RING_SIZE, height: RING_SIZE }}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: roundedStrength }}
        accessibilityLabel={`Habit strength ${roundedStrength}%, ${STRENGTH_LABELS[label]}`}
      >
        <Svg width={RING_SIZE} height={RING_SIZE}>
          {/* Background track */}
          <Circle
            cx={center}
            cy={center}
            r={RING_RADIUS}
            stroke={COLORS.ringTrack}
            strokeWidth={RING_STROKE_WIDTH}
            fill="none"
          />
          {/* Progress arc */}
          <AnimatedCircle
            animatedProps={animatedCircleProps}
            cx={center}
            cy={center}
            r={RING_RADIUS}
            stroke={ringColor}
            strokeWidth={RING_STROKE_WIDTH}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE}
            strokeLinecap="round"
            fill="none"
            rotation="-90"
            origin={`${center}, ${center}`}
          />
        </Svg>

        {/* Center content */}
        <View
          className="absolute inset-0 items-center justify-center"
          accessibilityElementsHidden
        >
          <AnimatedPercentage animatedValue={animatedStrength} />
        </View>
      </View>

      {/* Status Display */}
      <View className="ml-4 flex-1">
        {/* Strength label */}
        <View
          className="mb-1 self-start rounded-full px-2.5 py-1"
          style={{ backgroundColor: colors.background }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: colors.primary }}
          >
            {STRENGTH_LABELS[label]}
          </Text>
        </View>

        {/* Delta badge */}
        <View className="flex-row items-center gap-1">
          {deltaIsPositive && (
            <TrendingUp size={14} color={COLORS.positive} />
          )}
          {deltaIsNegative && (
            <TrendingDown size={14} color={COLORS.negative} />
          )}
          <Text
            className="text-sm"
            style={{
              color: deltaIsPositive
                ? COLORS.positive
                : deltaIsNegative
                  ? COLORS.negative
                  : COLORS.textSecondary,
            }}
          >
            {deltaText}
          </Text>
          <Text className="text-sm text-stone-500">{deltaLabel}</Text>
        </View>
      </View>
    </View>
  );
});
