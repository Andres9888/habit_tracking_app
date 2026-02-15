/**
 * RetryButton Component
 * Animated retry button with haptic feedback for error recovery
 */

import React from 'react';
import { Text, Pressable } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { useThemeColors } from '../../theme/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = { damping: 15, stiffness: 150 };

interface RetryButtonProps {
  onRetry: () => void;
}

export function RetryButton({ onRetry }: RetryButtonProps) {
  const { triggerLightImpact } = useHapticFeedback();
  const scale = useSharedValue(1);
  const { colors } = useThemeColors();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  const handlePress = () => {
    triggerLightImpact();
    onRetry();
  };

  return (
    <AnimatedPressable
      accessibilityHint='Attempts to reload the content'
      accessibilityLabel='Try Again'
      accessibilityRole='button'
      style={[
        {
          backgroundColor: colors.primary[500],
          borderRadius: 8,
          paddingHorizontal: 24,
          paddingVertical: 12,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text
        style={{ color: colors.text.inverse, fontSize: 17, fontWeight: '600' }}
      >
        Try Again
      </Text>
    </AnimatedPressable>
  );
}
