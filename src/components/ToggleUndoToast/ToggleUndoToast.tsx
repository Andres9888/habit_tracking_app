/**
 * ToggleUndoToast Component
 *
 * A specialized toast for habit toggle actions with:
 * - 3 second countdown timer with visual progress bar
 * - Undo action button
 * - Swipe to dismiss (triggers undo)
 * - Emerald color scheme for completion, stone for un-completion
 * - Support for queued toggles (shows most recent action)
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, X, Undo2 } from 'lucide-react-native';

export interface ToggleUndoToastProps {
  /** Toast visibility */
  visible: boolean;

  /** Name of the habit that was toggled */
  habitName: string;

  /** Date that was toggled (formatted string, e.g., "Dec 28") */
  dateLabel: string;

  /** Whether the toggle marked the habit as completed (true) or uncompleted (false) */
  wasCompleted: boolean;

  /** Duration before auto-dismiss in ms (default: 3000) */
  duration?: number;

  /** On dismiss callback (called when toast disappears without undo) */
  onDismiss?: () => void;

  /** On undo callback (called when user taps undo or swipes down) */
  onUndo?: () => void;
}

const DISMISS_THRESHOLD = 50;
const DEFAULT_DURATION = 3000;

export function ToggleUndoToast({
  visible,
  habitName,
  dateLabel,
  wasCompleted,
  duration = DEFAULT_DURATION,
  onDismiss,
  onUndo,
}: ToggleUndoToastProps) {
  const insets = useSafeAreaInsets();

  // Animation values
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const progressWidth = useSharedValue(100); // percentage

  // Handle dismiss (no undo - action persists)
  const handleDismiss = useCallback(() => {
    translateY.value = withSpring(100, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(0, { duration: 200 });
    progressWidth.value = 100;

    if (onDismiss) {
      setTimeout(() => {
        onDismiss();
      }, 250);
    }
  }, [onDismiss, translateY, opacity, progressWidth]);

  // Handle undo action
  const handleUndo = useCallback(() => {
    if (onUndo) {
      onUndo();
    }
    // Dismiss after undo
    translateY.value = withSpring(100, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(0, { duration: 200 });
    progressWidth.value = 100;
  }, [onUndo, translateY, opacity, progressWidth]);

  // Enter/exit animation
  useEffect(() => {
    if (visible) {
      // Reset and start animations
      progressWidth.value = 100;

      // Slide up and fade in
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });

      // Animate progress bar countdown
      progressWidth.value = withTiming(0, {
        duration: duration,
        easing: Easing.linear,
      });

      // Auto-dismiss after duration (action is confirmed)
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Slide down and fade out
      translateY.value = withSpring(100, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration, handleDismiss, translateY, opacity, progressWidth]);

  // Pan gesture for swipe to dismiss (triggers undo)
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow downward swipe
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        opacity.value = 1 - event.translationY / 100;
      }
    })
    .onEnd((event) => {
      // Use Math.round on velocity to avoid precision loss error in Reanimated
      const velocityY = Math.round(event.velocityY);
      if (event.translationY > DISMISS_THRESHOLD || velocityY > 500) {
        // Swiping down = undo the toggle
        runOnJS(handleUndo)();
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
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  if (!visible) return null;

  // Color scheme based on action
  const colors = wasCompleted
    ? {
        icon: '#10b981', // emerald-500
        iconBg: '#d1fae5', // emerald-100
        progress: '#10b981', // emerald-500
        progressBg: '#d1fae5', // emerald-100
        buttonBg: '#d1fae5', // emerald-100
        buttonBgPressed: '#a7f3d0', // emerald-200
        buttonText: '#059669', // emerald-600
        border: '#a7f3d0', // emerald-200
        shadow: '#10b981', // emerald-500
      }
    : {
        icon: '#78716c', // stone-500
        iconBg: '#f5f5f4', // stone-100
        progress: '#78716c', // stone-500
        progressBg: '#e7e5e4', // stone-200
        buttonBg: '#f5f5f4', // stone-100
        buttonBgPressed: '#e7e5e4', // stone-200
        buttonText: '#57534e', // stone-600
        border: '#e7e5e4', // stone-200
        shadow: '#78716c', // stone-500
      };

  const Icon = wasCompleted ? Check : X;
  const actionText = wasCompleted ? 'completed' : 'uncompleted';
  const accessibilityMessage = `${habitName} marked ${actionText} for ${dateLabel}. Tap undo to reverse.`;

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          accessible
          accessibilityLabel={accessibilityMessage}
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          style={[
            styles.toast,
            {
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
            containerStyle,
          ]}
        >
          {/* Content */}
          <View style={styles.content}>
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
              <Icon color={colors.icon} size={18} strokeWidth={2.5} />
            </View>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text numberOfLines={1} style={styles.message}>
                <Text style={styles.habitName}>"{habitName}"</Text>
                <Text style={styles.messageText}> {actionText}</Text>
              </Text>
              <Text style={styles.dateText}>{dateLabel}</Text>
            </View>

            {/* Undo Button */}
            <Pressable
              accessibilityLabel='Undo toggle'
              accessibilityHint={`Reverses the ${actionText} action`}
              accessibilityRole='button'
              style={({ pressed }) => [
                styles.undoButton,
                { backgroundColor: pressed ? colors.buttonBgPressed : colors.buttonBg },
              ]}
              onPress={handleUndo}
            >
              <Undo2 color={colors.buttonText} size={14} strokeWidth={2.5} />
              <Text style={[styles.undoText, { color: colors.buttonText }]}>UNDO</Text>
            </Pressable>
          </View>

          {/* Progress bar */}
          <View style={[styles.progressContainer, { backgroundColor: colors.progressBg }]}>
            <Animated.View
              style={[
                styles.progressBar,
                { backgroundColor: colors.progress },
                progressStyle,
              ]}
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    left: 20,
    position: 'absolute',
    right: 20,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  dateText: {
    color: '#a8a29e', // stone-400
    fontSize: 12,
    marginTop: 2,
  },
  habitName: {
    color: '#1c1917', // stone-900
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  message: {
    fontSize: 14,
  },
  messageContainer: {
    flex: 1,
  },
  messageText: {
    color: '#78716c', // stone-500
  },
  progressBar: {
    height: '100%',
  },
  progressContainer: {
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    height: 3,
    overflow: 'hidden',
    width: '100%',
  },
  toast: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    maxWidth: 400,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    width: '100%',
    elevation: 8,
  },
  undoButton: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  undoText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default ToggleUndoToast;
