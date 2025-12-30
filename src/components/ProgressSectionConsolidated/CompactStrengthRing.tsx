/**
 * CompactStrengthRing Component
 *
 * A compact 56px version of the strength ring for use in StatsGrid.
 * Displays the habit strength percentage with an animated SVG ring.
 *
 * Features:
 * - 56px diameter ring (reduced from 100px)
 * - Animated progress ring with level-based colors
 * - Optional trend badge
 * - Full accessibility support
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useReduceMotion } from '../../hooks/useReduceMotion';
import { getLevelFromStrength } from './types';
import type { CompactStrengthRingProps } from './StatsGridTypes';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Animation duration for ring fill */
const RING_ANIMATION_DURATION = 800;

/** Ring dimensions - compact 56px version */
const RING_SIZE = 56;
const STROKE_WIDTH = 6;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = RING_SIZE / 2;

/**
 * CompactStrengthRing - A compact strength indicator ring
 * Memoized to prevent re-renders when parent updates unrelated props
 */
export const CompactStrengthRing = React.memo(function CompactStrengthRing({
  strength,
  weeklyChange = 0,
}: CompactStrengthRingProps) {
  const reduceMotion = useReduceMotion();

  // Clamp strength to 0-100
  const clampedStrength = useMemo(
    () => Math.max(0, Math.min(100, strength)),
    [strength]
  );

  // Get level info for colors
  const levelInfo = useMemo(
    () => getLevelFromStrength(clampedStrength),
    [clampedStrength]
  );

  // Animation shared value
  const animatedStrength = useSharedValue(reduceMotion ? clampedStrength : 0);

  // Run ring fill animation
  useEffect(() => {
    if (reduceMotion) {
      animatedStrength.value = clampedStrength;
      return;
    }

    animatedStrength.value = withTiming(clampedStrength, {
      duration: RING_ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [clampedStrength, reduceMotion, animatedStrength]);

  // Animated props for the progress circle
  const animatedCircleProps = useAnimatedProps(() => ({
    // Round to avoid "Loss of precision during arithmetic conversion" error in Reanimated
    strokeDashoffset: Math.round(CIRCUMFERENCE * (1 - animatedStrength.value / 100)),
  }));

  // Trend badge configuration
  const getTrendBadge = () => {
    if (weeklyChange === 0) return null;

    const isPositive = weeklyChange > 0;
    const bgColor = isPositive ? '#dcfce7' : '#fee2e2'; // green-100 : red-100
    const textColor = isPositive ? '#16a34a' : '#dc2626'; // green-600 : red-600
    const prefix = isPositive ? '+' : '';

    return (
      <View
        accessibilityLabel={`${isPositive ? 'Up' : 'Down'} ${Math.abs(weeklyChange)} percent`}
        className='absolute -right-1 -top-1 rounded-full px-1'
        style={{ backgroundColor: bgColor }}
      >
        <Text className='text-[8px] font-semibold' style={{ color: textColor }}>
          {prefix}
          {weeklyChange}%
        </Text>
      </View>
    );
  };

  const accessibilityLabel = `Habit strength at ${Math.round(clampedStrength)} percent${
    weeklyChange === 0
      ? ''
      : `, ${weeklyChange > 0 ? 'up' : 'down'} ${Math.abs(weeklyChange)} percent this week`
  }`;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='progressbar'
      accessibilityValue={{
        max: 100,
        min: 0,
        now: clampedStrength,
      }}
      className='relative'
      style={{ height: RING_SIZE, width: RING_SIZE }}
    >
      {/* SVG Ring */}
      <Svg height={RING_SIZE} width={RING_SIZE}>
        {/* Background track */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          fill='none'
          r={RADIUS}
          stroke='#f3f4f6' // gray-100
          strokeWidth={STROKE_WIDTH}
        />
        {/* Animated progress arc */}
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx={CENTER}
          cy={CENTER}
          fill='none'
          origin={`${CENTER}, ${CENTER}`}
          r={RADIUS}
          rotation='-90'
          stroke={levelInfo.color}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          strokeLinecap='round'
          strokeWidth={STROKE_WIDTH}
        />
      </Svg>

      {/* Center content: emoji */}
      <View
        className='absolute items-center justify-center'
        style={{ height: RING_SIZE, width: RING_SIZE }}
      >
        <Text className='text-lg'>{levelInfo.emoji}</Text>
      </View>

      {/* Optional trend badge */}
      {getTrendBadge()}
    </View>
  );
});

export default CompactStrengthRing;
