/**
 * Animation hooks for ReminderOptionButton
 */

import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

export function useButtonAnimations(reduceMotion: boolean) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    if (reduceMotion) return;
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, reduceMotion]);

  const handlePressOut = useCallback(() => {
    if (reduceMotion) {
      // No animation in reduced motion mode
      scaleAnim.setValue(1);
      slideAnim.setValue(0);
      return;
    }
    // V11 Spec: Slide up animation (translateY -2px) with spring
    // Sequence: quick slide up, then spring back to normal, then scale back
    Animated.sequence([
      Animated.timing(slideAnim, {
        duration: 100,
        toValue: -2,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        friction: 4,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Scale back to normal simultaneously
    Animated.spring(scaleAnim, {
      friction: 10,
      tension: 300,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, slideAnim, reduceMotion]);

  return {
    handlePressIn,
    handlePressOut,
    scaleAnim,
    slideAnim,
  };
}
