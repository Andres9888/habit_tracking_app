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
import { borderRadius } from '../../theme/spacing';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '@/theme/typography';
import { springs } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = springs.standard;

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
          backgroundColor: colors.primary[700],
          borderRadius: borderRadius.small,
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
        style={{ ...typography.button, color: colors.text.inverse }}
      >
        Try Again
      </Text>
    </AnimatedPressable>
  );
}
