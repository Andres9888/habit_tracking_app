/**
 * useEntranceAnimation Hook
 * Handles fade-in and slide animation when habit card appears
 */

import { Animated, Easing } from 'react-native';
import { useEffect } from 'react';

export function useEntranceAnimation(
  fade: Animated.Value,
  translateY: Animated.Value
) {
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, translateY]);
}
