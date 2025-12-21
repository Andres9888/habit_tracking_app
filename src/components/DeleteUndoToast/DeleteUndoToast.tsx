/**
 * DeleteUndoToast Component
 *
 * A specialized toast for delete actions with:
 * - 5 second countdown timer with visual progress bar
 * - Undo action button
 * - Swipe to dismiss
 * - Red color scheme matching destructive action
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
import { Trash2, Undo2 } from 'lucide-react-native';

export interface DeleteUndoToastProps {
  /** Toast visibility */
  visible: boolean;

  /** Name of the item being deleted */
  itemName: string;

  /** Duration before auto-dismiss in ms (default: 5000) */
  duration?: number;

  /** On dismiss callback (called when toast disappears) */
  onDismiss?: () => void;

  /** On undo callback (called when user taps undo) */
  onUndo?: () => void;

  /** On confirm callback (called when timer expires without undo) */
  onConfirm?: () => void;
}

const DISMISS_THRESHOLD = 50;

export function DeleteUndoToast({
  visible,
  itemName,
  duration = 5000,
  onDismiss,
  onUndo,
  onConfirm,
}: DeleteUndoToastProps) {
  const insets = useSafeAreaInsets();

  // Animation values
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const progressWidth = useSharedValue(100); // percentage

  // Handle dismiss
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
    handleDismiss();
  }, [onUndo, handleDismiss]);

  // Handle confirm (timer expired)
  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    handleDismiss();
  }, [onConfirm, handleDismiss]);

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

      // Auto-confirm after duration
      const timer = setTimeout(() => {
        handleConfirm();
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
  }, [visible, duration, handleConfirm, translateY, opacity, progressWidth]);

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
        // Swiping down = cancel delete (undo)
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

  return (
    <View
      pointerEvents='box-none'
      style={[styles.container, { bottom: insets.bottom + 16 }]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          accessible
          accessibilityLabel={`${itemName} will be deleted. Tap undo to cancel.`}
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          style={[styles.toast, containerStyle]}
        >
          {/* Content */}
          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Trash2 color='#dc2626' size={18} strokeWidth={2} />
            </View>

            {/* Message */}
            <Text numberOfLines={1} style={styles.message}>
              <Text style={styles.itemName}>"{itemName}"</Text>
              <Text style={styles.messageText}> will be deleted</Text>
            </Text>

            {/* Undo Button */}
            <Pressable
              accessibilityLabel='Undo delete'
              accessibilityRole='button'
              style={({ pressed }) => [
                styles.undoButton,
                pressed && styles.undoButtonPressed,
              ]}
              onPress={handleUndo}
            >
              <Undo2 color='#dc2626' size={14} strokeWidth={2.5} />
              <Text style={styles.undoText}>UNDO</Text>
            </Pressable>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, progressStyle]} />
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
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#fee2e2', // red-100
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  itemName: {
    color: '#1c1917', // stone-900
    fontWeight: '600',
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  messageText: {
    color: '#78716c', // stone-500
  },
  progressBar: {
    backgroundColor: '#dc2626', // red-600
    height: '100%',
  },
  progressContainer: {
    backgroundColor: '#fee2e2', // red-100
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    height: 3,
    overflow: 'hidden',
    width: '100%',
  },
  toast: {
    backgroundColor: '#ffffff',
    borderColor: '#fecaca', // red-200
    borderRadius: 24,
    borderWidth: 1,
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#dc2626', // red-600
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    width: '100%',
    elevation: 8,
  },
  undoButton: {
    alignItems: 'center',
    backgroundColor: '#fee2e2', // red-100
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  undoButtonPressed: {
    backgroundColor: '#fecaca', // red-200
  },
  undoText: {
    color: '#dc2626', // red-600
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default DeleteUndoToast;
