/**
 * Toast/Snackbar Component
 * Based on UX Specification Section 4.2
 *
 * Purpose: Brief, non-blocking messages
 * Variants: Success (green, checkmark), Error (red, X), Info (blue, i), Warning (orange, !), Undo (with button)
 * Behavior: Slides up from bottom, auto-dismisses (3-5s), swipe to dismiss, max 1 visible
 * Usage: Habit completed, sync error, undo prompt, export success
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type ViewStyle,
} from 'react-native';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning' | 'undo';

export interface ToastProps {
  /** Toast visibility */
  visible: boolean;

  /** Toast message */
  message: string;

  /** Toast variant */
  variant?: ToastVariant;

  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;

  /** On dismiss callback */
  onDismiss?: () => void;

  /** Action button label (for undo variant) */
  actionLabel?: string;

  /** Action button handler (for undo variant) */
  onAction?: () => void;

  /** Custom style */
  style?: ViewStyle;
}

/**
 * Variant configuration (icons, colors)
 */
const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    icon: string;
    backgroundColor: string;
    textColor: string;
  }
> = {
  success: {
    icon: '✓',
    backgroundColor: '#10B981', // theme.custom.colors.success
    textColor: '#FFFFFF',
  },
  error: {
    icon: '✕',
    backgroundColor: '#EF4444', // theme.custom.colors.error
    textColor: '#FFFFFF',
  },
  info: {
    icon: 'ℹ',
    backgroundColor: '#3B82F6', // theme.custom.colors.info
    textColor: '#FFFFFF',
  },
  warning: {
    icon: '!',
    backgroundColor: '#F59E0B', // theme.custom.colors.warning[500]
    textColor: '#FFFFFF',
  },
  undo: {
    icon: '↶',
    backgroundColor: '#374151', // theme.custom.colors.gray[700]
    textColor: '#FFFFFF',
  },
};

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

  // Animation values
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  // Swipe to dismiss
  const DISMISS_THRESHOLD = 50;

  // Enter/exit animation
  useEffect(() => {
    if (visible) {
      // Slide up and fade in
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto-dismiss after duration
      if (duration > 0 && onDismiss) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      // Slide down and fade out
      translateY.value = withSpring(100, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration]);

  // Handle dismiss
  const handleDismiss = () => {
    translateY.value = withSpring(100, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(0, { duration: 200 });

    if (onDismiss) {
      // Delay callback to allow animation to complete
      setTimeout(() => {
        onDismiss();
      }, 250);
    }
  };

  // Pan gesture for swipe to dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow downward swipe
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        opacity.value = 1 - (event.translationY / 100);
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD || event.velocityY > 500) {
        // Dismiss if swiped past threshold
        runOnJS(handleDismiss)();
      } else {
        // Spring back to visible position
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
        opacity.value = withTiming(1, { duration: 150 });
      }
    });

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View
      style={[
        styles.container,
        { bottom: insets.bottom + 16 },
      ]}
      pointerEvents="box-none"
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
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
          accessible={true}
          accessibilityLabel={`${variant} message: ${message}`}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{config.icon}</Text>
          </View>

          {/* Message */}
          <Text
            style={[
              theme.custom.typography.body,
              styles.message,
              { color: config.textColor },
            ]}
            numberOfLines={2}
          >
            {message}
          </Text>

          {/* Action Button (for undo variant) */}
          {variant === 'undo' && onAction && (
            <Pressable
              style={styles.actionButton}
              onPress={() => {
                onAction();
                handleDismiss();
              }}
              accessibilityLabel={actionLabel}
              accessibilityRole="button"
            >
              <Text
                style={[
                  theme.custom.typography.button,
                  { color: theme.custom.colors.primary[400] },
                ]}
              >
                {actionLabel}
              </Text>
            </Pressable>
          )}

          {/* Dismiss Button (X) - for variants other than undo */}
          {variant !== 'undo' && (
            <Pressable
              style={styles.dismissButton}
              onPress={handleDismiss}
              accessibilityLabel="Dismiss"
              accessibilityRole="button"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.dismissIcon, { color: config.textColor }]}>
                ✕
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  message: {
    flex: 1,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dismissButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Toast;
