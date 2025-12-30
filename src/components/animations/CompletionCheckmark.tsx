/**
 * CompletionCheckmark Component
 *
 * A reusable animated checkmark badge that pops in when a section is completed.
 * Used throughout the Workshop and Reward sections in the Motivation System.
 *
 * Animation:
 * - Delayed entrance with staggered timing based on sectionIndex
 * - Bouncy scale animation (0 -> 1.2 -> 1)
 * - Fade in opacity
 * - Accessibility support via reduceMotion prop
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import {
  SPRING_BOUNCY,
  STAGGER_DELAY,
  BASE_CHECKMARK_DELAY,
} from './constants';

export interface CompletionCheckmarkProps {
  /** Whether the checkmark should be visible */
  isVisible: boolean;
  /** Section index for staggered animation timing */
  sectionIndex: number;
  /** Whether to run entrance animation */
  shouldAnimate: boolean;
  /** When true, skips animations for accessibility */
  reduceMotion?: boolean;
}

export function CompletionCheckmark({
  isVisible,
  sectionIndex,
  shouldAnimate,
  reduceMotion = false,
}: CompletionCheckmarkProps) {
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

    const delay = sectionIndex * STAGGER_DELAY + BASE_CHECKMARK_DELAY;

    const timeout = setTimeout(() => {
      scale.value = withSequence(
        withSpring(1.2, SPRING_BOUNCY),
        withSpring(1, { damping: 15, stiffness: 200 })
      );
      opacity.value = withTiming(1, { duration: 150 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, shouldAnimate, reduceMotion, sectionIndex, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          right: -4,
          top: -4,
        },
      ]}
    >
      <View className='h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-sm'>
        <Check className='text-white' size={12} strokeWidth={3} />
      </View>
    </Animated.View>
  );
}
