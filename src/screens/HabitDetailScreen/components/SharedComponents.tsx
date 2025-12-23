/**
 * Shared UI Components for HabitDetailScreen
 * Reusable components used across multiple tabs
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
  Easing,
} from 'react-native-reanimated';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  ChevronRight,
  Check,
  AlertTriangle,
} from 'lucide-react-native';

/**
 * ActionButton Component
 * Standard action button with icon, label, optional subtitle, and variants
 */
export function ActionButton({
  icon: Icon,
  label,
  onPress,
  showChevron = false,
  subtitle,
  variant = 'default',
}: {
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  subtitle?: string;
  variant?: 'default' | 'destructive' | 'boost';
}) {
  const isDestructive = variant === 'destructive';
  const isBoost = variant === 'boost';

  // Build accessible label with context
  const accessibleLabel = subtitle
    ? `${label}. ${subtitle}${isDestructive ? '. This is a destructive action.' : ''}`
    : `${label}${isDestructive ? '. This is a destructive action.' : ''}`;

  return (
    <Pressable
      accessibilityLabel={accessibleLabel}
      accessibilityRole="button"
      className={clsx(
        'flex-row items-center gap-3 rounded-xl border px-4 py-3.5 active:opacity-70',
        isDestructive && 'border-red-200/60 bg-red-50/50',
        isBoost && 'border-violet-200/60 bg-gradient-to-r from-violet-50 to-indigo-50',
        !isDestructive && !isBoost && 'border-stone-200 bg-white/80'
      )}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View
        className={clsx(
          'h-10 w-10 items-center justify-center rounded-xl',
          isBoost && 'bg-gradient-to-br from-violet-500 to-indigo-600',
          isDestructive && 'bg-red-100',
          !isBoost && !isDestructive && 'bg-stone-100'
        )}
      >
        <Icon
          className={clsx(
            isDestructive && 'text-red-500',
            isBoost && 'text-white',
            !isDestructive && !isBoost && 'text-stone-600'
          )}
          size={20}
          strokeWidth={2.25}
        />
      </View>
      <View className="flex-1">
        <Text
          className={clsx(
            'text-base font-medium',
            isDestructive && 'text-red-600',
            isBoost && 'text-violet-900',
            !isDestructive && !isBoost && 'text-stone-800'
          )}
        >
          {label}
        </Text>
        {subtitle && (
          <Text className={clsx(
            'text-xs',
            isBoost ? 'text-violet-600' : 'text-stone-500'
          )}>
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <ChevronRight
          className={clsx(
            isDestructive && 'text-red-400',
            isBoost && 'text-violet-400',
            !isDestructive && !isBoost && 'text-stone-400'
          )}
          size={20}
        />
      )}
    </Pressable>
  );
}

/**
 * Section Card Component for consistent styling
 * Includes animated press state (scale 0.98) with Springs.button for tappable cards
 * T4: Press feedback with scale animation and shadow elevation change
 */
export function SectionCard({
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
    // Shadow properties for iOS
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [2, 4]),
    shadowOffset: {
      width: 0,
      height: interpolate(elevation.value, [1, 2], [1, 2]),
    },
    // Elevation for Android
    elevation: elevation.value,
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    // T4.1: Use Springs.button (damping: 15, stiffness: 300)
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    // T4.3: Reduce shadow/elevation on press for pressed-in effect
    shadowOpacity.value = withSpring(0.04, { damping: 15, stiffness: 300 });
    elevation.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale, shadowOpacity, elevation]);

  const handlePressOut = useCallback(() => {
    'worklet';
    // T4.1: Use Springs.button for release
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    // T4.3: Restore shadow/elevation
    shadowOpacity.value = withSpring(0.08, { damping: 15, stiffness: 300 });
    elevation.value = withSpring(2, { damping: 15, stiffness: 300 });
  }, [scale, shadowOpacity, elevation]);

  if (onPress) {
    return (
      <Animated.View
        style={[
          animatedStyle,
          { shadowColor: '#78716c' } // stone-500 for shadow color
        ]}
      >
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          className={clsx(
            'rounded-2xl bg-white p-4',
            className
          )}
          onPress={onPress}
          onPressIn={() => {
            handlePressIn();
          }}
          onPressOut={() => {
            handlePressOut();
          }}
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
 * AnimatedSection Component for Motivation Tab
 * Wraps sections with staggered slide-up entrance animations
 * Respects reduceMotion preference and only animates on first tab visit
 *
 * @param index - Section index (0-5) for stagger delay calculation
 * @param shouldAnimate - Whether to run entrance animation (first visit only)
 * @param reduceMotion - Whether to skip animations for accessibility
 */
export function AnimatedSection({
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
  const STAGGER_DELAY = 80; // 80ms between sections per spec
  const INITIAL_TRANSLATE_Y = 24; // Starting Y offset per spec

  // Start at final values if not animating or reduce motion enabled
  const translateY = useSharedValue(shouldAnimate && !reduceMotion ? INITIAL_TRANSLATE_Y : 0);
  const opacity = useSharedValue(shouldAnimate && !reduceMotion ? 0 : 1);

  useEffect(() => {
    // Skip if not animating or reduce motion is enabled
    if (!shouldAnimate || reduceMotion) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    // Apply staggered entrance animation with Springs.gentle
    const delay = index * STAGGER_DELAY;

    // Delay the animation based on section index
    const timeout = setTimeout(() => {
      translateY.value = withSpring(0, {
        damping: 28,    // Springs.gentle
        stiffness: 180, // Springs.gentle
        mass: 1.2,      // Springs.gentle - slight overshoot
      });
      opacity.value = withTiming(1, { duration: 300 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [shouldAnimate, reduceMotion, index, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

/**
 * CompletionCheckmark Component
 * Animated checkmark badge that pops in when a section is filled
 *
 * Design spec (T2 Progress Checkmarks):
 * - Positioned at top-right of section icon
 * - Emerald-500 background with white check icon
 * - Pop-in animation: scale 0 → 1.2 → 1 (Springs.bouncy)
 * - Delayed 600ms after section entrance animation
 *
 * @param isVisible - Whether the checkmark should be shown (section is filled)
 * @param sectionIndex - Section index for staggered delay calculation
 * @param shouldAnimate - Whether entrance animation should run (first tab visit)
 * @param reduceMotion - Whether to skip animations for accessibility
 */
export function CompletionCheckmark({
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
  const STAGGER_DELAY = 80;
  const BASE_CHECKMARK_DELAY = 600; // Wait for section entrance

  const scale = useSharedValue(isVisible && shouldAnimate && !reduceMotion ? 0 : (isVisible ? 1 : 0));
  const opacity = useSharedValue(isVisible && shouldAnimate && !reduceMotion ? 0 : (isVisible ? 1 : 0));

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
    const delay = (sectionIndex * STAGGER_DELAY) + BASE_CHECKMARK_DELAY;

    const timeout = setTimeout(() => {
      // Pop-in animation: 0 → 1.2 → 1 using Springs.bouncy
      scale.value = withSequence(
        withSpring(1.2, {
          damping: 8,    // Springs.bouncy
          stiffness: 300, // Springs.bouncy
        }),
        withSpring(1, {
          damping: 15,   // Settle down
          stiffness: 300,
        })
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
 * PulsingIcon Component for Empty State Icons (T3.1)
 * Wraps icons with subtle opacity + scale pulse animation
 *
 * Design spec (T3 Improved Empty States):
 * - Opacity: 0.5 → 1 → 0.5 (2000ms loop)
 * - Scale: 1 → 1.05 → 1 (synced with opacity)
 * - Only animates when reduceMotion is false
 *
 * @param children - The icon element to wrap
 * @param reduceMotion - Whether to skip animations for accessibility
 */
export function PulsingIcon({
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
      // Cleanup - reset to default values
      opacity.value = 1;
      scale.value = 1;
    };
  }, [reduceMotion, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

/**
 * Danger Zone Section Component (T4.3)
 * Groups destructive actions with red-tinted styling
 */
export function DangerZoneSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View className="mt-4">
      {/* Red-tinted section header */}
      <View className="mb-3 flex-row items-center gap-2 px-1">
        <View className="h-5 w-5 items-center justify-center rounded-md bg-red-100">
          <AlertTriangle className="text-red-500" size={12} />
        </View>
        <Text className="text-xs font-semibold uppercase tracking-wider text-red-500">
          Danger Zone
        </Text>
      </View>

      {/* Red-tinted card container */}
      <View className="overflow-hidden rounded-2xl border border-red-200/50 bg-red-50/30">
        {children}
      </View>
    </View>
  );
}

/**
 * Animated Pressable Card Component
 * Used for individual motivation cards (vision board, affirmations) with scale 0.98 press animation
 * Respects reduce motion accessibility setting
 */
export function AnimatedPressableCard({
  children,
  className,
  onPress,
  onLongPress,
  accessibilityLabel,
  reduceMotion = false,
}: {
  children: React.ReactNode;
  className?: string;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
  reduceMotion?: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    // Skip animation if reduce motion is enabled
    if (reduceMotion) return;
    scale.value = withTiming(0.98, { duration: 100 });
  }, [scale, reduceMotion]);

  const handlePressOut = useCallback(() => {
    'worklet';
    // Skip animation if reduce motion is enabled
    if (reduceMotion) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, [scale, reduceMotion]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        className={className}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={() => {
          handlePressIn();
        }}
        onPressOut={() => {
          handlePressOut();
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
