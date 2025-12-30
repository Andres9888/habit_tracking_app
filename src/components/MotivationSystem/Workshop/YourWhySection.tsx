/**
 * YourWhySection Component
 * Displays and allows editing of the user's "why" statement for a habit
 *
 * Part of the Motivation System Workshop tab
 * Story T1.2-T1.5: Create YourWhySection component with empty/filled states
 *
 * Scientific Basis:
 * - Self-Determination Theory (Deci & Ryan): Intrinsic motivation from personal meaning
 * - Noom clinical studies: Users with defined purpose show 3x higher retention
 */

import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Plus, Check, Pencil } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  PulsingIcon,
  CompletionCheckmark,
  SPRING_BUTTON,
  SPRING_GENTLE,
  STAGGER_DELAY,
} from '../../animations';

export interface YourWhySectionProps {
  /** The habit's "why" statement (undefined if not set) */
  why: string | undefined;
  /** Callback when user taps to edit/add their why */
  onPress: () => void;
  /** Whether to run entrance animations (first tab visit only) */
  shouldAnimate?: boolean;
  /** Whether to skip animations for accessibility */
  reduceMotion?: boolean;
  /** Section index for staggered animation timing */
  sectionIndex?: number;
}

/**
 * SectionCard Component for consistent styling with press animation
 * Matches mockup: app-card with border, 16px radius, subtle shadow
 */
function SectionCard({
  children,
  className,
  onPress,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.05);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [4, 8]),
    shadowOffset: {
      width: 0,
      height: interpolate(elevation.value, [1, 2], [1, 2]),
    },
    elevation: elevation.value,
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.02, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.05, SPRING_BUTTON);
    elevation.value = withSpring(2, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [onPress]);

  if (onPress) {
    return (
      <Animated.View
        style={[
          animatedStyle,
          { shadowColor: '#000' },
        ]}
      >
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          className={clsx('rounded-xl border border-stone-200 bg-white p-3', className)}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      className={clsx(
        'rounded-xl border border-stone-200 bg-white p-3',
        className
      )}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}

/**
 * AnimatedSection Component for staggered entrance animations
 */
function AnimatedSection({
  children,
  index,
  shouldAnimate,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  index: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const INITIAL_TRANSLATE_Y = 24;

  const translateY = useSharedValue(
    shouldAnimate && !reduceMotion ? INITIAL_TRANSLATE_Y : 0
  );
  const opacity = useSharedValue(shouldAnimate && !reduceMotion ? 0 : 1);

  useEffect(() => {
    if (!shouldAnimate || reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    const delay = index * STAGGER_DELAY;

    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, SPRING_GENTLE);
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * YourWhySection - Main component
 *
 * Displays the user's "why" statement with:
 * - Empty state: Pulsing heart icon with "Set up" CTA
 * - Filled state: Rose-tinted card with the why statement in quotes
 * - Completion checkmark when filled
 * - Rose accent color (border-l-rose-400)
 */
export function YourWhySection({
  why,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 0,
}: YourWhySectionProps) {
  const hasWhy = !!why;

  return (
    <AnimatedSection
      index={sectionIndex}
      shouldAnimate={shouldAnimate}
      reduceMotion={reduceMotion}
    >
      <SectionCard
        accessibilityLabel={hasWhy ? 'Edit your why' : 'Add your why'}
        onPress={onPress}
        className="border-l-4 border-l-rose-400"
      >
        {/* Header row: icon + title on left, action on right */}
        <View className="mb-1.5 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-base">❤️</Text>
            <Text className="text-xs font-semibold text-rose-600">
              Your Why
            </Text>
          </View>
          {hasWhy ? (
            <Pencil className="text-stone-400" size={14} />
          ) : (
            <View className="flex-row items-center gap-1">
              <Plus className="text-rose-600" size={12} />
              <Text className="text-xs font-medium text-rose-600">Set up</Text>
            </View>
          )}
        </View>

        {/* Content */}
        {hasWhy ? (
          <Text className="text-sm italic leading-relaxed text-stone-700">
            "{why}"
          </Text>
        ) : (
          <Text className="text-sm text-stone-500">
            Define your deeper motivation
          </Text>
        )}

        {/* Completion checkmark */}
        <CompletionCheckmark
          isVisible={hasWhy}
          sectionIndex={sectionIndex}
          shouldAnimate={shouldAnimate}
          reduceMotion={reduceMotion}
        />
      </SectionCard>
    </AnimatedSection>
  );
}

export default YourWhySection;
