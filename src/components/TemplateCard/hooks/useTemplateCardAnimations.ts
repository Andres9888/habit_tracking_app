/**
 * useTemplateCardAnimations Hook
 *
 * Animation logic for TemplateCard entrance and success states
 */

import { useEffect } from 'react';

import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface UseTemplateCardAnimationsProps {
  animationIndex: number;
  isImported: boolean;
  reducedMotion: boolean;
}

export function useTemplateCardAnimations({
  animationIndex,
  isImported,
  reducedMotion,
}: UseTemplateCardAnimationsProps) {
  const skipAnimation = animationIndex === 0;
  const cardOpacity = useSharedValue(skipAnimation ? 1 : 0);
  const cardTranslateY = useSharedValue(skipAnimation ? 0 : 20);
  const pressScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.06);
  const successGlow = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);

  // Entrance animation
  useEffect(() => {
    if (skipAnimation) return;
    const delay = animationIndex * 80;
    cardOpacity.value = withDelay(
      delay,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) })
    );
    cardTranslateY.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 })
    );

    return () => {
      cancelAnimation(cardOpacity);
      cancelAnimation(cardTranslateY);
    };
  }, [animationIndex, skipAnimation, cardOpacity, cardTranslateY]);

  // Success glow animation
  useEffect(() => {
    if (isImported) {
      checkmarkScale.value = withSpring(1, { damping: 8, stiffness: 150 });
      if (!reducedMotion) {
        successGlow.value = withSequence(
          withTiming(0.6, { duration: 200 }),
          withTiming(0, { duration: 800 })
        );
      }
    } else {
      checkmarkScale.value = 0;
      successGlow.value = 0;
    }

    return () => {
      cancelAnimation(checkmarkScale);
      cancelAnimation(successGlow);
    };
  }, [isImported, checkmarkScale, successGlow, reducedMotion]);

  const containerStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: cardOpacity.value ?? 1,
      transform: [
        { translateY: cardTranslateY.value ?? 0 },
        { scale: pressScale.value ?? 1 },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      shadowOpacity: shadowOpacity.value ?? 0.06,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    'worklet';
    return { opacity: successGlow.value ?? 0 };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: checkmarkScale.value ?? 0,
      transform: [{ scale: checkmarkScale.value ?? 0 }],
    };
  });

  return {
    checkmarkStyle,
    containerStyle,
    glowStyle,
    pressScale,
    shadowOpacity,
    shadowStyle,
  };
}
