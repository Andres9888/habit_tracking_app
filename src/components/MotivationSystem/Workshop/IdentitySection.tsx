/**
 * IdentitySection Component
 * Displays and allows editing of the user's identity statement for a habit
 *
 * Part of the Motivation System Workshop tab
 * Story T2.2-T2.5: Create IdentitySection component with "I am a..." prefix
 *
 * Scientific Basis:
 * - James Clear's Atomic Habits (10M+ copies): Identity precedes behavior
 * - Research shows identity-based habits have 2x persistence vs outcome-based
 * - "I am a runner" vs "I run" - identity creates intrinsic motivation
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
import { User, Plus, Check } from 'lucide-react-native';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { PulsingIcon, CompletionCheckmark } from '../../animations';

export interface IdentitySectionProps {
  /** The habit's identity statement (undefined if not set) */
  identity: string | undefined;
  /** Callback when user taps to edit/add their identity */
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
const SPRING_GENTLE = { damping: 28, mass: 1.2, stiffness: 180 };

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
    elevation: elevation.value,
    shadowOffset: {
      height: interpolate(elevation.value, [1, 2], [1, 2]),
      width: 0,
    },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: interpolate(elevation.value, [1, 2], [2, 4]),
    transform: [{ scale: scale.value }],
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
          accessibilityRole='button'
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
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * IdentitySection - Main component
 *
 * Displays the user's identity statement with:
 * - Empty state: Pulsing user icon with "Set up" CTA
 * - Filled state: Indigo-tinted card with "I am a..." statement
 * - Completion checkmark when filled
 * - Indigo accent color (border-l-indigo-400)
 * - Explanatory text: "Not 'I run' — who you ARE"
 */
export function IdentitySection({
  identity,
  onPress,
  shouldAnimate = false,
  reduceMotion = false,
  sectionIndex = 1,
}: IdentitySectionProps) {
  const hasIdentity = !!identity;

  // Format identity with "I am a" prefix if not already present
  const formattedIdentity = hasIdentity
    ? identity.toLowerCase().startsWith('i am')
      ? identity
      : `I am a ${identity}`
    : '';

  return (
    <AnimatedSection
      index={sectionIndex}
      reduceMotion={reduceMotion}
      shouldAnimate={shouldAnimate}
    >
      <SectionCard
        accessibilityLabel={
          hasIdentity ? 'Edit your identity' : 'Add your identity'
        }
        className='border-l-4 border-l-indigo-400'
        onPress={onPress}
      >
        <View className='flex-row items-start gap-3'>
          {/* Icon with completion checkmark */}
          <View className='relative h-10 w-10 items-center justify-center rounded-xl bg-indigo-100'>
            {hasIdentity ? (
              <User className='text-indigo-500' size={20} />
            ) : (
              <PulsingIcon reduceMotion={reduceMotion}>
                <User className='text-indigo-500' size={20} />
              </PulsingIcon>
            )}
            <CompletionCheckmark
              isVisible={hasIdentity}
              reduceMotion={reduceMotion}
              sectionIndex={sectionIndex}
              shouldAnimate={shouldAnimate}
            />
          </View>

          {/* Content area */}
          <View className='flex-1'>
            {hasIdentity ? (
              /* Filled state */
              <>
                <Text className='mb-1 font-semibold text-stone-800'>
                  Identity
                </Text>
                <Text className='text-sm font-medium text-indigo-700'>
                  "{formattedIdentity}"
                </Text>
                <Text className='mt-1 text-xs text-stone-400'>
                  Not "I run" — who you ARE
                </Text>
              </>
            ) : (
              /* Empty state */
              <>
                <View className='mb-1 flex-row items-center justify-between'>
                  <Text className='font-semibold text-stone-800'>Identity</Text>
                  <View className='flex-row items-center gap-1'>
                    <Plus className='text-indigo-600' size={12} />
                    <Text className='text-xs font-medium text-indigo-600'>
                      Set up
                    </Text>
                  </View>
                </View>
                <Text className='text-sm text-stone-500'>
                  Define who you're becoming
                </Text>
                <Text className='mt-1 text-xs text-stone-400'>
                  Not "I run" — who you ARE
                </Text>
              </>
            )}
          </View>
        </View>
      </SectionCard>
    </AnimatedSection>
  );
}

export default IdentitySection;
