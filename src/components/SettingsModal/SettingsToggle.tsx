/**
 * SettingsToggle Component
 *
 * Custom animated toggle switch using react-native-reanimated.
 * Provides smooth 60fps animations with haptic feedback.
 * Supports disabled state and accessibility.
 */

import React, { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';

interface SettingsToggleProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function SettingsToggle({
  isEnabled,
  onToggle,
  disabled = false,
  accessibilityLabel,
}: SettingsToggleProps) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(isEnabled ? 1 : 0);

  useEffect(() => {
    const duration = reducedMotion ? 0 : 300;
    progress.value = withTiming(isEnabled ? 1 : 0, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [isEnabled, progress, reducedMotion]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.15)', '#6366f1']
    ),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 20 }],
  }));

  const handlePress = useCallback(() => {
    if (!disabled) {
      onToggle(!isEnabled);
    }
  }, [disabled, isEnabled, onToggle]);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='switch'
      accessibilityState={{ checked: isEnabled, disabled }}
      disabled={disabled}
      hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
      onPress={handlePress}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  knob: {
    backgroundColor: '#ffffff',
    borderRadius: 11,
    elevation: 3,
    height: 22,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 22,
  },
  track: {
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    padding: 3,
    width: 48,
  },
});
