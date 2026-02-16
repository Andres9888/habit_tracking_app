/**
 * ChainNudge Component
 * Gentle reminder to complete habits at strategic moments
 * Shows "Don't break the chain" messaging when:
 * - User has a good streak going (≥3 days)
 * - It's evening and they haven't completed all habits
 * - They're about to leave the app
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

interface ChainNudgeProps {
  /** Current streak count */
  streak: number;
  /** Number of incomplete habits */
  incompleteCount: number;
  /** Total habits for today */
  totalCount: number;
  /** Habit name (for single habit) */
  habitName?: string;
  /** Callback when user taps "Complete Now" */
  onCompleteNow?: () => void;
  /** Callback when user dismisses */
  onDismiss?: () => void;
  /** Whether to reduce animations */
  reduceMotion?: boolean;
}

/**
 * Get nudge message based on streak and incomplete count
 */
function getNudgeMessage(
  streak: number,
  incompleteCount: number,
  habitName?: string
): { title: string; subtitle: string; emoji: string } {
  if (incompleteCount === 1 && habitName) {
    return {
      emoji: '🔗',
      subtitle: `Keep your ${streak}-day streak alive!`,
      title: `Just "${habitName}" left`,
    };
  }

  if (incompleteCount === 1) {
    return {
      emoji: '🔗',
      subtitle: `Don't break your ${streak}-day chain!`,
      title: 'One habit to go',
    };
  }

  if (streak >= 7) {
    return {
      emoji: '🔥',
      subtitle: `${incompleteCount} habits left to keep your ${streak}-day streak`,
      title: 'Almost there!',
    };
  }

  return {
    emoji: '⏰',
    subtitle: `${incompleteCount} habits remaining today`,
    title: 'Finish strong',
  };
}

export function ChainNudge({
  streak,
  incompleteCount,
  totalCount,
  habitName,
  onCompleteNow,
  onDismiss,
  reduceMotion = false,
}: ChainNudgeProps) {
  // Only show for streaks ≥ 3 days
  if (streak < 3 || incompleteCount === 0) {
    return null;
  }

  const message = getNudgeMessage(streak, incompleteCount, habitName);
  const completionPercentage = Math.round(
    ((totalCount - incompleteCount) / totalCount) * 100
  );

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInUp.duration(280)}
      exiting={reduceMotion ? undefined : FadeOutDown.duration(280)}
      style={styles.container}
    >
      <Pressable
        style={styles.dismissButton}
        onPress={onDismiss}
        hitSlop={8}
      >
        <Ionicons name="close" size={20} color={colors.text.tertiary} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.emoji}>{message.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{message.title}</Text>
          <Text style={styles.subtitle}>{message.subtitle}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${completionPercentage}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{completionPercentage}% done</Text>
      </View>

      {onCompleteNow && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onCompleteNow}
        >
          <Text style={styles.buttonText}>Complete Now</Text>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 12,
    shadowColor: colors.primary[600],
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'SF-Pro-Text-Semibold',
    fontSize: 15,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.warning,
    borderLeftWidth: 4,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  dismissButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
  },
  emoji: {
    fontSize: 28,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  progressBar: {
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  progressFill: {
    backgroundColor: colors.primary[500],
    height: '100%',
  },
  progressText: {
    color: colors.text.secondary,
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 13,
    fontWeight: '500',
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  title: {
    color: colors.text.primary,
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 17,
    fontWeight: '600',
  },
});
