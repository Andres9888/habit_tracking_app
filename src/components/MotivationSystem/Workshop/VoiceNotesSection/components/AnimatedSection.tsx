/**
 * AnimatedSection Component
 * Provides staggered entrance animations for sections
 */

import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useReduceMotion } from '../../../../../hooks/useReduceMotion';
import { SPRING_GENTLE, STAGGER_DELAY } from '../../../../animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  index: number;
  shouldAnimate: boolean;
  reduceMotion?: boolean;
}

const INITIAL_TRANSLATE_Y = 24;

export function AnimatedSection({
  children,
  index,
  shouldAnimate,
  reduceMotion: reduceMotionProp,
}: AnimatedSectionProps) {
  const systemReduceMotion = useReduceMotion();
  const reduceMotion = reduceMotionProp ?? systemReduceMotion;
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
