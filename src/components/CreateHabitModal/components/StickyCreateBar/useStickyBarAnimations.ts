/**
 * useStickyBarAnimations Hook
 * Handles color transitions and enable-bounce animations
 */

import { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Motion } from '../../../../constants/motion';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import { DEFAULT_BUTTON_COLOR } from './colorUtils';

export function useStickyBarAnimations(
  disabled: boolean,
  selectedColor: string | undefined
) {
  const { triggerSuccess, triggerMediumImpact } = useHapticFeedback();
  const scale = useRef(new Animated.Value(1)).current;
  const colorOpacity = useRef(new Animated.Value(1)).current;
  const previousColorRef = useRef<string>(
    selectedColor ?? DEFAULT_BUTTON_COLOR
  );
  const wasDisabled = useRef(disabled);

  // Animate color transitions when selectedColor changes
  useEffect(() => {
    const currentColor = selectedColor ?? DEFAULT_BUTTON_COLOR;
    if (previousColorRef.current !== currentColor) {
      Animated.sequence([
        Animated.timing(colorOpacity, {
          duration: Motion.duration.fast,
          easing: Motion.easing.inEase,
          toValue: 0.85,
          useNativeDriver: true,
        }),
        Animated.timing(colorOpacity, {
          duration: Motion.duration.base,
          easing: Motion.easing.outEase,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
      previousColorRef.current = currentColor;
    }
  }, [selectedColor, colorOpacity]);

  // Haptic + subtle press-in/out bounce when button becomes enabled.
  // We scale DOWN then back to 1 (instead of up to 1.02) because upscaling a
  // rasterized native-driven view stretches its GPU texture and blurs it.
  useEffect(() => {
    if (wasDisabled.current && !disabled) {
      triggerMediumImpact();
      Animated.sequence([
        Animated.timing(scale, {
          duration: 100,
          easing: Motion.easing.outEase,
          toValue: 0.98,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          duration: 100,
          easing: Motion.easing.inEase,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
    wasDisabled.current = disabled;
  }, [disabled, scale, triggerMediumImpact]);

  const handlePressIn = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.fast,
      easing: Motion.easing.inEase,
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scale, {
      duration: Motion.duration.base,
      easing: Motion.easing.outEase,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return {
    colorOpacity,
    handlePressIn,
    handlePressOut,
    scale,
    triggerSuccess,
  };
}
