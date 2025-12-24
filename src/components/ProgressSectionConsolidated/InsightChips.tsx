/**
 * InsightChips Component
 *
 * Horizontal scroll container with key insight chips.
 * Displays: Current Streak, Best Day, Focus Day, Monthly Progress
 *
 * Features:
 * - Horizontal scroll with touch momentum
 * - Staggered entrance animations (50ms delay per chip)
 * - Pulse animation for active streak chip
 * - Haptic feedback on tap
 * - Full accessibility support
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { Motion, Springs } from '../../constants/motion';

import type { InsightChipsProps, InsightChipData } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Stagger delay between chip entrance animations (ms) */
const CHIP_STAGGER_DELAY = 50;

/** Duration of chip entrance animation (ms) */
const CHIP_ENTRANCE_DURATION = 300;

/** Pulse animation cycle duration (ms) */
const PULSE_DURATION = 2000;

interface InsightChipProps {
  chip: InsightChipData;
  index: number;
  reduceMotion: boolean;
  onHapticFeedback: () => void;
}

/**
 * Individual insight chip with entrance and pulse animations
 */
function InsightChip({
  chip,
  index,
  reduceMotion,
  onHapticFeedback,
}: InsightChipProps) {
  // Entrance animation values
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateX = useSharedValue(reduceMotion ? 0 : 20);

  // Pulse animation for active streak
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  // Press animation
  const pressScale = useSharedValue(1);

  // Entrance animation effect
  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      translateX.value = 0;
      return;
    }

    const delay = index * CHIP_STAGGER_DELAY;
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: CHIP_ENTRANCE_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );
    translateX.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );
  }, [index, reduceMotion, opacity, translateX]);

  // Pulse animation effect for active streak
  useEffect(() => {
    if (!chip.hasPulse || reduceMotion) {
      pulseScale.value = 1;
      pulseOpacity.value = 0;
      return;
    }

    // Scale pulse: 1 -> 1.05 -> 1 (continuous)
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: PULSE_DURATION / 2 }),
        withTiming(1, { duration: PULSE_DURATION / 2 })
      ),
      -1, // Repeat forever
      true // Reverse
    );

    // Opacity pulse for the outer ring: 0 -> 0.6 -> 0 (continuous)
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: PULSE_DURATION / 2 }),
        withTiming(0, { duration: PULSE_DURATION / 2 })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(pulseScale);
      cancelAnimation(pulseOpacity);
    };
  }, [chip.hasPulse, reduceMotion, pulseScale, pulseOpacity]);

  // Press handlers
  const handlePressIn = () => {
    pressScale.value = withSpring(0.95, Springs.button);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, Springs.button);
  };

  const handlePress = () => {
    onHapticFeedback();
    chip.onPress?.();
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: pressScale.value }],
  }));

  const pulseRingStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  // Border color mapping
  const borderColorMap: Record<string, string> = {
    'amber-200': '#fde68a',
    'emerald-200': '#a7f3d0',
    'orange-200': '#fed7aa',
    'violet-200': '#ddd6fe',
  };

  const borderColor = borderColorMap[chip.borderColor] || '#e7e5e4';

  const accessibilityLabel = `${chip.label}: ${chip.value}${chip.hasPulse ? ', active streak' : ''}`;
  const accessibilityHint = chip.isInteractive
    ? 'Double tap to view details'
    : undefined;

  return (
    <AnimatedPressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={chip.isInteractive ? 'button' : 'text'}
      disabled={!chip.isInteractive}
      style={containerStyle}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        className='relative rounded-xl bg-white px-3 py-2'
        style={{
          borderColor,
          borderWidth: 1,
          minWidth: 80,
        }}
      >
        {/* Pulse ring overlay for active streak */}
        {chip.hasPulse && (
          <Animated.View
            className='absolute -inset-0.5 rounded-xl'
            pointerEvents='none'
            style={[
              {
                borderColor: '#fb923c', // orange-400
                borderWidth: 2,
              },
              pulseRingStyle,
            ]}
          />
        )}

        <View className='flex-row items-center gap-1.5'>
          <Text className='text-base'>{chip.icon}</Text>
          <Text className='text-sm font-semibold text-stone-800'>
            {chip.value}
          </Text>
        </View>
        <Text className='mt-0.5 text-xs text-stone-500'>{chip.label}</Text>
      </View>
    </AnimatedPressable>
  );
}

/**
 * InsightChips Component
 *
 * Horizontal scroll container with key insight chips showing:
 * - Current streak (with pulse animation if active)
 * - Best performing day
 * - Focus day (worst day - interactive)
 * - Monthly completion rate
 */
export function InsightChips({
  currentStreak,
  bestDay,
  focusDay,
  monthlyCompleted,
  monthlyTotal,
  onFocusDayPress,
}: InsightChipsProps) {
  const reduceMotion = useReduceMotion();
  const { triggerSelection } = useHapticFeedback();

  // Build chip data array
  const chips = useMemo<InsightChipData[]>(() => {
    const chipData: InsightChipData[] = [];

    // Current Streak chip
    chipData.push({
      borderColor: 'orange-200',
      hasPulse: currentStreak > 0,
      icon: '🔥',
      id: 'streak',
      isInteractive: false,
      label: 'Current Streak',
      value: currentStreak === 1 ? '1 day' : `${currentStreak} days`,
    });

    // Best Day chip
    if (bestDay) {
      chipData.push({
        borderColor: 'emerald-200',
        icon: '🏆',
        id: 'bestDay',
        isInteractive: false,
        label: `${Math.round(bestDay.rate)}% completion`,
        value: bestDay.name,
      });
    }

    // Focus Day chip (interactive)
    if (focusDay) {
      chipData.push({
        borderColor: 'amber-200',
        icon: '⚡',
        id: 'focusDay',
        isInteractive: !!onFocusDayPress,
        label: 'Focus day',
        onPress: onFocusDayPress,
        value: focusDay.name,
      });
    }

    // Monthly Progress chip
    chipData.push({
      borderColor: 'violet-200',
      icon: '📅',
      id: 'monthly',
      isInteractive: false,
      label: 'This month',
      value: `${monthlyCompleted}/${monthlyTotal}`,
    });

    return chipData;
  }, [
    currentStreak,
    bestDay,
    focusDay,
    monthlyCompleted,
    monthlyTotal,
    onFocusDayPress,
  ]);

  return (
    <View className='mb-4'>
      <ScrollView
        horizontal
        accessibilityLabel='Habit insights'
        accessibilityRole='list'
        contentContainerStyle={{ gap: 8, paddingRight: 8 }}
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -4 }}
      >
        {chips.map((chip, index) => (
          <InsightChip
            key={chip.id}
            chip={chip}
            index={index}
            reduceMotion={reduceMotion}
            onHapticFeedback={triggerSelection}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default InsightChips;
