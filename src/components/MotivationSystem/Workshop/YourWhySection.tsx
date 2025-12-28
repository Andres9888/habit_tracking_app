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
import { Heart, Plus, Check } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';

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

// Animation spring configs
const SPRING_BUTTON = { damping: 15, stiffness: 300 };
const SPRING_BOUNCY = { damping: 8, stiffness: 300 };
const SPRING_GENTLE = { damping: 28, stiffness: 180, mass: 1.2 };
const STAGGER_DELAY = 80;
const BASE_CHECKMARK_DELAY = 600;

/**
 * PulsingIcon Component for Empty State Icons
 * Wraps icons with subtle opacity + scale pulse animation
 */
function PulsingIcon({
  children,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  reduceMotion?: boolean;
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 1;
      scale.value = 1;
      return;
    }

    // Create infinite pulse animation
    const pulseOpacity = () => {
      opacity.value = withTiming(0.5, { duration: 1000 }, (finished) => {
        if (finished) {
          opacity.value = withTiming(1, { duration: 1000 }, (finished2) => {
            if (finished2) {
              runOnJS(pulseOpacity)();
            }
          });
        }
      });
    };

    const pulseScale = () => {
      scale.value = withTiming(1.05, { duration: 1000 }, (finished) => {
        if (finished) {
          scale.value = withTiming(1, { duration: 1000 }, (finished2) => {
            if (finished2) {
              runOnJS(pulseScale)();
            }
          });
        }
      });
    };

    pulseOpacity();
    pulseScale();

    return () => {
      // Animation cleanup happens automatically when component unmounts
    };
  }, [reduceMotion, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

/**
 * CompletionCheckmark Component
 * Animated checkmark badge that pops in when the section is filled
 */
function CompletionCheckmark({
  isVisible,
  sectionIndex,
  shouldAnimate,
  reduceMotion = false,
}: {
  isVisible: boolean;
  sectionIndex: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(
    isVisible && shouldAnimate && !reduceMotion ? 0 : isVisible ? 1 : 0
  );
  const opacity = useSharedValue(
    isVisible && shouldAnimate && !reduceMotion ? 0 : isVisible ? 1 : 0
  );

  useEffect(() => {
    if (!isVisible) {
      scale.value = 0;
      opacity.value = 0;
      return;
    }

    if (!shouldAnimate || reduceMotion) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }

    // Calculate delay: section stagger + base checkmark delay
    const delay = sectionIndex * STAGGER_DELAY + BASE_CHECKMARK_DELAY;

    const timeout = setTimeout(() => {
      // Pop-in animation: 0 → 1.2 → 1 using Springs.bouncy
      scale.value = withSequence(
        withSpring(1.2, SPRING_BOUNCY),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
      opacity.value = withTiming(1, { duration: 150 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, shouldAnimate, reduceMotion, sectionIndex, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: -4,
          right: -4,
        },
      ]}
    >
      <View className="h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
        <Check className="text-white" size={12} strokeWidth={3} />
      </View>
    </Animated.View>
  );
}

/**
 * SectionCard Component for consistent styling with press animation
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
  const shadowOpacity = useSharedValue(0.08);
  const elevation = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [2, 4]),
    shadowOffset: {
      width: 0,
      height: interpolate(elevation.value, [1, 2], [1, 2]),
    },
    elevation: elevation.value,
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.04, SPRING_BUTTON);
    elevation.value = withSpring(1, SPRING_BUTTON);
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, SPRING_BUTTON);
    shadowOpacity.value = withSpring(0.08, SPRING_BUTTON);
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
          { shadowColor: '#78716c' }, // stone-500
        ]}
      >
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          className={clsx('rounded-2xl bg-white p-4', className)}
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
        'rounded-2xl bg-white p-4 shadow-sm shadow-stone-200/50',
        className
      )}
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
        <View className="flex-row items-start gap-3">
          {/* Icon with completion checkmark */}
          <View className="relative h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
            {hasWhy ? (
              <Heart className="text-rose-500" size={20} />
            ) : (
              <PulsingIcon reduceMotion={reduceMotion}>
                <Heart className="text-rose-500" size={20} />
              </PulsingIcon>
            )}
            <CompletionCheckmark
              isVisible={hasWhy}
              sectionIndex={sectionIndex}
              shouldAnimate={shouldAnimate}
              reduceMotion={reduceMotion}
            />
          </View>

          {/* Content area */}
          <View className="flex-1">
            {hasWhy ? (
              /* Filled state */
              <>
                <Text className="mb-1 font-semibold text-stone-800">
                  Your Why
                </Text>
                <Text className="text-sm italic text-stone-600">"{why}"</Text>
              </>
            ) : (
              /* Empty state */
              <>
                <View className="mb-1 flex-row items-center justify-between">
                  <Text className="font-semibold text-stone-800">Your Why</Text>
                  <View className="flex-row items-center gap-1">
                    <Plus className="text-rose-600" size={12} />
                    <Text className="text-xs font-medium text-rose-600">
                      Set up
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-stone-500">
                  Define your deeper motivation
                </Text>
              </>
            )}
          </View>
        </View>
      </SectionCard>
    </AnimatedSection>
  );
}

export default YourWhySection;
