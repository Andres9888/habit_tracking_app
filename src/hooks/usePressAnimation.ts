/**
 * usePressAnimation - Reusable press feedback animation hook
 * Provides scale animation for Pressable components
 */

import { useCallback } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const SPRING_CONFIG = { damping: 15, stiffness: 300 };

export function usePressAnimation(pressedScale = 0.95) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(pressedScale, SPRING_CONFIG);
  }, [pressedScale, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, handlePressIn, handlePressOut };
}
