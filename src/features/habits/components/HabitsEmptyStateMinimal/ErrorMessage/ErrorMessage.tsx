/**
 * ErrorMessage - Animated error card with shake effect
 */

import { Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { useThemeColors } from '@/theme/ThemeContext';
import type { ErrorMessageProps } from '../types';
import { ERROR_COLORS_LIGHT, ERROR_COLORS_DARK } from './constants';
import { ErrorIcon } from './ErrorIcon';
import { DismissButton } from './DismissButton';
import { useErrorAnimations } from './useErrorAnimations';

export function ErrorMessage({
  message,
  onDismiss,
  autoDismiss = false,
}: ErrorMessageProps) {
  const { isDark } = useThemeColors();
  const errorColors = isDark ? ERROR_COLORS_DARK : ERROR_COLORS_LIGHT;

  const { animatedStyle, handleDismiss } = useErrorAnimations({
    autoDismiss,
    onDismiss,
  });

  return (
    <Animated.View
      accessibilityLiveRegion='polite'
      accessibilityRole='alert'
      style={[
        animatedStyle,
        {
          alignItems: 'center',
          backgroundColor: errorColors.background,
          borderColor: errorColors.border,
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
      <ErrorIcon isDark={isDark} />
      <Text
        style={{
          color: errorColors.text,
          flex: 1,
          fontSize: 13,
          fontWeight: '500',
          marginHorizontal: 12,
        }}
      >
        {message}
      </Text>
      <DismissButton isDark={isDark} onPress={handleDismiss} />
    </Animated.View>
  );
}
