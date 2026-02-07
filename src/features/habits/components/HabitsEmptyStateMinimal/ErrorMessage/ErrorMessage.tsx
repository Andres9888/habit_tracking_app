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

import { Text } from 'react-native';
import Animated from 'react-native-reanimated';

import type { ErrorMessageProps } from '../types';
import { ERROR_COLORS } from './constants';
import { ErrorIcon } from './ErrorIcon';
import { DismissButton } from './DismissButton';
import { useErrorAnimations } from './useErrorAnimations';

export function ErrorMessage({
  message,
  onDismiss,
  autoDismiss = false,
}: ErrorMessageProps) {
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
          fontSize: 13,
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
