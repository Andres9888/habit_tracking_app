/**
 * ArchiveUndoToast Component
 *
 * A specialized toast for archive actions with:
 * - 5 second countdown timer with visual progress bar
 * - Undo action button
 * - Swipe to dismiss
 * - Amber color scheme matching archive swipe action
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
import { Package, Undo2 } from 'lucide-react-native';

export interface ArchiveUndoToastProps {
  /** Toast visibility */
  visible: boolean;

  /** Name of the archived habit */
  habitName: string;

  /** Duration before auto-dismiss in ms (default: 5000) */
  duration?: number;

  /** On dismiss callback (called when toast disappears) */
  onDismiss?: () => void;

  /** On undo callback (called when user taps undo) */
  onUndo?: () => void;
}

const DISMISS_THRESHOLD = 50;

export function ArchiveUndoToast({
  visible,
  habitName,
  duration = 5000,
  onDismiss,
  onUndo,
}: ArchiveUndoToastProps) {
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

      // Auto-dismiss after duration
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
          accessibilityLabel={`${habitName} archived. Tap undo to restore.`}
          accessibilityLiveRegion='polite'
          accessibilityRole='alert'
          style={[styles.toast, containerStyle]}
        >
          {/* Content */}
          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Package color='#f59e0b' size={18} strokeWidth={2} />
            </View>

            {/* Message */}
            <Text numberOfLines={1} style={styles.message}>
              <Text style={styles.habitName}>"{habitName}"</Text>
              <Text style={styles.messageText}> archived</Text>
            </Text>

            {/* Undo Button */}
            <Pressable
              accessibilityLabel='Undo archive'
              accessibilityRole='button'
              style={({ pressed }) => [
                styles.undoButton,
                pressed && styles.undoButtonPressed,
              ]}
              onPress={handleUndo}
            >
              <Undo2 color='#f59e0b' size={14} strokeWidth={2.5} />
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
    left: 16,
    position: 'absolute',
    right: 16,
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
  habitName: {
    color: '#ffffff',
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  messageText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressBar: {
    backgroundColor: '#f59e0b',
    height: '100%',
  },
  progressContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    height: 3,
    overflow: 'hidden',
    width: '100%',
  },
  toast: {
    backgroundColor: '#1f2937',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    width: '100%',
    elevation: 8,
  },
  undoButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  undoButtonPressed: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  undoText: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ArchiveUndoToast;
