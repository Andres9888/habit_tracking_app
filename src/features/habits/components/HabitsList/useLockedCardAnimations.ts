/**
 * useLockedCardAnimations Hook
 * Animation logic for LockedHabitCard entrance and press interactions
 */

import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface UseLockedCardAnimationsParams {
  reduceMotion?: boolean;
}

interface UseLockedCardAnimationsReturn {
  opacity: Animated.Value;
  entranceScale: Animated.Value;
  pressScale: Animated.Value;
  handlePressIn: () => void;
  handlePressOut: () => void;
}

export function useLockedCardAnimations({
  reduceMotion = false,
}: UseLockedCardAnimationsParams): UseLockedCardAnimationsReturn {
  const entranceScale = useRef(new Animated.Value(0.94)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      entranceScale.setValue(1);
      opacity.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.spring(entranceScale, {
        damping: 12,
        stiffness: 140,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, entranceScale, reduceMotion]);

  const handlePressIn = () => {
    if (reduceMotion) {
      pressScale.setValue(0.97);
      return;
    }
    Animated.spring(pressScale, {
      damping: 18,
      stiffness: 240,
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (reduceMotion) {
      pressScale.setValue(1);
      return;
    }
    Animated.spring(pressScale, {
      damping: 18,
      stiffness: 240,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return {
    entranceScale,
    handlePressIn,
    handlePressOut,
    opacity,
    pressScale,
  };
}
