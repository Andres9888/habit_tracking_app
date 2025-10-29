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
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
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
  error: {
    backgroundColor: '#EF4444',
    icon: '✕', // theme.custom.colors.error
    textColor: '#FFFFFF',
  },
  info: {
    backgroundColor: '#3B82F6',
    icon: 'ℹ', // theme.custom.colors.info
    textColor: '#FFFFFF',
  },
  success: {
    backgroundColor: '#10B981',
    icon: '✓', // theme.custom.colors.success
    textColor: '#FFFFFF',
  },
  undo: {
    backgroundColor: '#374151',
    icon: '↶', // theme.custom.colors.gray[700]
    textColor: '#FFFFFF',
  },
  warning: {
    backgroundColor: '#F59E0B',
    icon: '!', // theme.custom.colors.warning[500]
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
        opacity.value = 1 - event.translationY / 100;
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
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
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
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{config.icon}</Text>
          </View>

          {/* Message */}
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

          {/* Action Button (for undo variant) */}
          {variant === 'undo' && onAction && (
            <Pressable
              accessibilityLabel={actionLabel}
              accessibilityRole='button'
              style={styles.actionButton}
              onPress={() => {
                onAction();
                handleDismiss();
              }}
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
              accessibilityLabel='Dismiss'
              accessibilityRole='button'
              hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
              style={styles.dismissButton}
              onPress={handleDismiss}
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
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  container: {
    alignItems: 'center',
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 9999,
  },
  dismissButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  dismissIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  message: {
    flex: 1,
  },
  toast: {
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: 400,
    gap: 12,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default Toast;
