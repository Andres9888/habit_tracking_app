/**
 * FocusMode Component - Immersive Single-Habit Focus Experience
 *
 * Highlights one habit at a time with:
 * - Dimmed background overlay
 * - Optional Pomodoro timer (25 min default)
 * - Prominent completion button
 * - Haptic feedback + celebration on complete
 *
 * Design System:
 * - Typography: 34/22/17/13 (display/title/body/caption)
 * - Primary green: #047857 (text), #059669 (buttons)
 * - Animations: springify().damping(18), 280ms duration, 60ms stagger
 * - Border radius: 16px cards, 12px buttons
 * - Shadows: 4px offset, 16px blur, 0.08 opacity
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '../../theme/typography';
import { springs, durations } from '../../theme/animations';
import { shadows } from '../../theme';
import type { FocusModeProps } from './FocusMode.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function FocusMode({
  habitName,
  habitIcon = '📝',
  habitColor = '#059669',
  completed = false,
  timerDuration = 25,
  enableTimer = true,
  onComplete,
  onDismiss,
}: FocusModeProps) {
  const { colors, isDark } = useThemeColors();
  const [timeRemaining, setTimeRemaining] = useState(timerDuration * 60); // seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);

  // Animation values
  const overlayOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.8);
  const completeButtonScale = useSharedValue(1);

  // Mount animation
  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: durations.enter });
    cardScale.value = withSpring(1, springs.standard);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!enableTimer || !isTimerRunning || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, enableTimer]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = useCallback(() => {
    setIsTimerRunning(true);
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const handlePauseTimer = useCallback(() => {
    setIsTimerRunning(false);
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Celebrate animation
    completeButtonScale.value = withSpring(1.2, springs.bouncy, () => {
      completeButtonScale.value = withSpring(1, springs.standard, () => {
        if (onComplete) {
          runOnJS(onComplete)();
        }
      });
    });
  }, [onComplete]);

  const handleDismiss = useCallback(() => {
    overlayOpacity.value = withTiming(0, { duration: durations.quick }, () => {
      if (onDismiss) {
        runOnJS(onDismiss)();
      }
    });
  }, [onDismiss]);

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const completeButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: completeButtonScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Dimmed overlay */}
      <Animated.View
        style={[
          styles.overlay,
          { backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.75)' },
          overlayStyle,
        ]}
      />

      {/* Close button */}
      <Pressable
        style={styles.closeButton}
        onPress={handleDismiss}
        hitSlop={20}
      >
        <Text style={[styles.closeButtonText, { color: colors.text.secondary }]}>
          ✕
        </Text>
      </Pressable>

      {/* Focused habit card */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: habitColor,
          },
          shadows.elevated,
          cardStyle,
        ]}
      >
        {/* Habit icon */}
        <Text style={styles.habitIcon}>{habitIcon}</Text>

        {/* Habit name */}
        <Text
          style={[
            typography.displayLarge,
            styles.habitName,
            { color: colors.text.primary },
          ]}
        >
          {habitName}
        </Text>

        {/* Timer */}
        {enableTimer && (
          <View style={styles.timerContainer}>
            <Text
              style={[
                typography.heading1,
                styles.timerText,
                { color: habitColor },
              ]}
            >
              {formatTime(timeRemaining)}
            </Text>

            {/* Timer controls */}
            <View style={styles.timerControls}>
              {!isTimerRunning ? (
                <Pressable
                  style={[
                    styles.timerButton,
                    { backgroundColor: habitColor + '20' },
                  ]}
                  onPress={handleStartTimer}
                >
                  <Text style={[typography.button, { color: habitColor }]}>
                    Start Timer
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[
                    styles.timerButton,
                    { backgroundColor: colors.gray?.[200] || '#e5e7eb' },
                  ]}
                  onPress={handlePauseTimer}
                >
                  <Text style={[typography.button, { color: colors.text.secondary }]}>
                    Pause
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* Completion button */}
        <Animated.View style={completeButtonAnimatedStyle}>
          <Pressable
            style={[
              styles.completeButton,
              {
                backgroundColor: isCompleted ? colors.gray?.[400] : habitColor,
              },
              shadows.button,
            ]}
            onPress={handleComplete}
            disabled={isCompleted}
          >
            <Text style={[typography.button, styles.completeButtonText]}>
              {isCompleted ? '✓ Completed!' : 'Mark Complete'}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Motivational text */}
        {!isCompleted && (
          <Text
            style={[
              typography.body,
              styles.motivationText,
              { color: colors.text.secondary },
            ]}
          >
            Focus on this one thing. You've got this! 💪
          </Text>
        )}

        {isCompleted && (
          <Text
            style={[
              typography.body,
              styles.motivationText,
              { color: '#047857' },
            ]}
          >
            Awesome! Another day, another link in the chain! 🔗
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1001,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: '300',
  },
  card: {
    width: SCREEN_WIDTH - 48,
    maxWidth: 480,
    borderRadius: 16,
    borderWidth: 3,
    padding: 32,
    alignItems: 'center',
  },
  habitIcon: {
    fontSize: 72,
    marginBottom: 16,
  },
  habitName: {
    textAlign: 'center',
    marginBottom: 32,
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    marginBottom: 16,
    fontVariant: ['tabular-nums'],
  },
  timerControls: {
    width: '100%',
    alignItems: 'center',
  },
  timerButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  completeButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 17,
  },
  motivationText: {
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FocusMode;
