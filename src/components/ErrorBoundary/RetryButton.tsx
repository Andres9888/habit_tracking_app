/**
 * RetryButton Component
 * Animated retry button with haptic feedback for error recovery
 */

import React from 'react';
import { Text } from 'react-native';

import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { borderRadius } from '../../theme/spacing';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '@/theme/typography';

interface RetryButtonProps {
  onRetry: () => void;
}

export function RetryButton({ onRetry }: RetryButtonProps) {
  const { triggerLightImpact } = useHapticFeedback();
  const { colors } = useThemeColors();

  const handlePress = () => {
    triggerLightImpact();
    onRetry();
  };

  return (
    <AnimatedPressable
      accessibilityHint='Attempts to reload the content'
      accessibilityLabel='Try Again'
      accessibilityRole='button'
      style={{
        backgroundColor: colors.primary[700],
        borderRadius: borderRadius.small,
        paddingHorizontal: 24,
        paddingVertical: 12,
      }}
      onPress={handlePress}
    >
      <Text style={{ ...typography.button, color: colors.text.inverse }}>
        Try Again
      </Text>
    </AnimatedPressable>
  );
}
