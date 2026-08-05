/**
 * Toast/Snackbar Component
 * Brief, non-blocking messages with swipe to dismiss
 */

import React from 'react';
import { View, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../theme';
import type { ToastProps } from './types';
import { VARIANT_CONFIG } from './constants';
import { styles } from './styles';
import { useToastAnimations } from './useToastAnimations';
import { ToastActions } from './ToastActions';

export function Toast({
  visible,
  message,
  variant = 'info',
  duration = 3000,
  onDismiss,
  actionLabel = 'Undo',
  onAction,
  style,
}: ToastProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const config = VARIANT_CONFIG[variant];

  const { animatedStyle, handleDismiss, panGesture } = useToastAnimations({
    duration,
    onDismiss,
    visible,
  });

  if (!visible) return null;

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <View collapsable={false}>
          <Animated.View
            accessible
            accessibilityLabel={`${variant} message: ${message}`}
            accessibilityLiveRegion='polite'
            accessibilityRole='alert'
            style={[
              styles.toast,
              {
                backgroundColor: config.backgroundColor,
                borderRadius: theme.custom.borderRadius.medium,
                ...theme.custom.shadows.card,
              },
              animatedStyle,
              style,
            ]}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{config.icon}</Text>
            </View>

            <Text
              numberOfLines={2}
              style={[
                theme.custom.typography.body,
                styles.message,
                { color: config.textColor },
              ]}
            >
              {message}
            </Text>

            <ToastActions
              actionLabel={actionLabel}
              textColor={config.textColor}
              variant={variant}
              onAction={onAction}
              onDismiss={handleDismiss}
            />
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

export default Toast;
