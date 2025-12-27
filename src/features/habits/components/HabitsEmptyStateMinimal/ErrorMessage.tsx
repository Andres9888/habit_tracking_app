/**
 * ErrorMessage - Animated error card with shake effect
 *
 * Features:
 * - Styled container (red-50 bg, red-200 border, 12px radius)
 * - Error icon (red circle with "!")
 * - Error text display
 * - Dismiss button ("✕")
 * - Entrance animation: fade + slide down + shake
 * - Respects reduced motion preferences
 * - Proper accessibility attributes (role="alert", liveRegion="polite")
 */

import { useCallback, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ERROR_ANIMATION } from './animations';
import type { ErrorMessageProps } from './types';

/**
 * Error message styling colors
 */
const ERROR_COLORS = {
  background: '#FEF2F2', // red-50
  border: '#FECACA', // red-200
  dismissText: '#DC2626', // red-600
  iconBackground: '#EF4444', // red-500
  iconText: '#FFFFFF', // white
  text: '#991B1B', // red-800
} as const;

/**
 * Error icon component - red circle with "!" exclamation
 */
function ErrorIcon() {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: ERROR_COLORS.iconBackground,
        borderRadius: 10,
        height: 20,
        justifyContent: 'center',
        width: 20,
      }}
    >
      <Text
        style={{
          color: ERROR_COLORS.iconText,
          fontSize: 14,
          fontWeight: '700',
          lineHeight: 16,
        }}
      >
        !
      </Text>
    </View>
  );
}

/**
 * Dismiss button component - "✕" icon
 */
function DismissButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel='Dismiss error message'
      accessibilityRole='button'
      hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        padding: 4,
      })}
      onPress={onPress}
    >
      <Text
        style={{
          color: ERROR_COLORS.dismissText,
          fontSize: 18,
          fontWeight: '500',
          lineHeight: 20,
        }}
      >
        ✕
      </Text>
    </Pressable>
  );
}

/**
 * Animated error message card with shake effect
 */
export function ErrorMessage({
  message,
  onDismiss,
  autoDismiss = false,
}: ErrorMessageProps) {
  const shouldReduceMotion = useReducedMotion();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-10);
  const translateX = useSharedValue(0);

  // Handle dismiss with fade out animation
  const handleDismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 150 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)();
      }
    });
  }, [onDismiss, opacity]);

  useEffect(() => {
    if (shouldReduceMotion) {
      // Skip animations for reduced motion
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    const {
      entranceDuration,
      shakeDuration,
      shakeDistance,
      shakeOscillations,
    } = ERROR_ANIMATION;

    // Entrance animation: fade in + slide down
    opacity.value = withTiming(1, {
      duration: entranceDuration,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withTiming(0, {
      duration: entranceDuration,
      easing: Easing.out(Easing.ease),
    });

    // Shake animation: oscillate left-right
    // Calculate timing for each oscillation segment
    const segmentDuration = shakeDuration / (shakeOscillations * 2);

    // Build shake sequence: [right, left, right, left, right, left, center]
    // For 3 oscillations: +8, -8, +8, -8, +8, -8, 0
    const shakeSequence = [];
    for (let i = 0; i < shakeOscillations; i++) {
      shakeSequence.push(
        withTiming(shakeDistance, { duration: segmentDuration }),
        withTiming(-shakeDistance, { duration: segmentDuration })
      );
    }
    // Return to center
    shakeSequence.push(withTiming(0, { duration: segmentDuration }));

    // Delay shake to start after entrance
    setTimeout(() => {
      translateX.value = withSequence(...shakeSequence);
    }, entranceDuration);
  }, [opacity, shouldReduceMotion, translateX, translateY]);

  // Auto-dismiss after delay if enabled
  useEffect(() => {
    if (!autoDismiss) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, ERROR_ANIMATION.autoDismissDelay);

    return () => clearTimeout(timer);
  }, [autoDismiss, handleDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View
      accessibilityLiveRegion='polite'
      accessibilityRole='alert'
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          backgroundColor: ERROR_COLORS.background,
          borderColor: ERROR_COLORS.border,
          borderRadius: 12,
          borderWidth: 1,
          flexDirection: 'row',
          marginTop: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          width: '100%',
        },
      ]}
    >
      <ErrorIcon />
      <Text
        style={{
          color: ERROR_COLORS.text,
          flex: 1,
          fontSize: 14,
          fontWeight: '500',
          marginHorizontal: 12,
        }}
      >
        {message}
      </Text>
      <DismissButton onPress={handleDismiss} />
    </Animated.View>
  );
}
