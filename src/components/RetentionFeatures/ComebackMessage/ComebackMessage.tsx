/**
 * ComebackMessage Component
 * Encouraging, non-guilt-inducing message when user missed yesterday
 * Focuses on growth mindset and getting back on track
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

interface ComebackMessageProps {
  /** Number of days missed */
  daysMissed?: number;
  /** Best streak the user achieved */
  bestStreak?: number;
  /** Callback when user taps "Start Today" */
  onStartToday?: () => void;
  /** Whether to reduce animations */
  reduceMotion?: boolean;
}

const COMEBACK_MESSAGES = [
  {
    emoji: '🌅',
    message: 'Welcome back! Every day is a fresh start.',
    submessage: 'The best time to start again is now.',
  },
  {
    emoji: '💪',
    message: 'Missed yesterday? That's okay!',
    submessage: 'Building habits is about progress, not perfection.',
  },
  {
    emoji: '🌱',
    message: 'Growth happens in the comeback.',
    submessage: 'Every expert was once a beginner who kept going.',
  },
  {
    emoji: '🎯',
    message: 'Today is what matters most.',
    submessage: 'You can't change yesterday, but you can win today.',
  },
  {
    emoji: '🔥',
    message: 'Ready to rebuild your streak?',
    submessage: 'Small steps today lead to big results tomorrow.',
  },
];

/**
 * Get a comeback message based on days missed and best streak
 */
function getComebackMessage(daysMissed: number, bestStreak?: number) {
  // For longer absences, show the growth-focused message
  if (daysMissed > 7) {
    return COMEBACK_MESSAGES[2]; // Growth happens in the comeback
  }
  
  // If they had a good streak, acknowledge it
  if (bestStreak && bestStreak >= 7) {
    return COMEBACK_MESSAGES[4]; // Ready to rebuild
  }
  
  // For short absences, keep it light
  if (daysMissed === 1) {
    return COMEBACK_MESSAGES[1]; // Missed yesterday? That's okay
  }
  
  // Default: fresh start
  return COMEBACK_MESSAGES[0];
}

export function ComebackMessage({
  daysMissed = 1,
  bestStreak,
  onStartToday,
  reduceMotion = false,
}: ComebackMessageProps) {
  const selectedMessage = getComebackMessage(daysMissed, bestStreak);

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(280).delay(100)}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>{selectedMessage.emoji}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{selectedMessage.message}</Text>
        <Text style={styles.subtitle}>{selectedMessage.submessage}</Text>
        
        {bestStreak && bestStreak > 0 && (
          <View style={styles.streakReminder}>
            <Ionicons name="trophy" size={16} color={colors.primary[600]} />
            <Text style={styles.streakText}>
              Your best: {bestStreak} day{bestStreak !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
        
        {onStartToday && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={onStartToday}
          >
            <Text style={styles.buttonText}>Start Today</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 20,
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
    borderColor: colors.primary[100],
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  content: {
    flex: 1,
  },
  emoji: {
    fontSize: 32,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakReminder: {
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  streakText: {
    color: colors.primary[700],
    fontFamily: 'SF-Pro-Text-Medium',
    fontSize: 13,
    fontWeight: '500',
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4,
  },
  title: {
    color: colors.text.primary,
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 17,
    fontWeight: '600',
  },
});
