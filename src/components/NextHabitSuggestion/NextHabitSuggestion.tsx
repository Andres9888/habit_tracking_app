/* eslint-disable max-lines */
/**
 * NextHabitSuggestion Component
 * Shows the next incomplete habit to focus on
 * Reduces decision fatigue by highlighting one habit at a time
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ArrowRight, Zap } from 'lucide-react-native';
import type { NextHabitSuggestionProps } from './types';

export function NextHabitSuggestion({
  habit,
  onPress,
  completedCount,
  totalCount,
}: NextHabitSuggestionProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  // Subtle pulsing glow
  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // All habits complete
  if (!habit) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.completedTitle}>All done for today!</Text>
        <Text style={styles.completedSubtitle}>
          {totalCount} habit{totalCount === 1 ? '' : 's'} completed
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => onPress?.(habit)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, cardStyle]}>
        {/* Glow effect */}
        <Animated.View style={[styles.glow, glowStyle]} />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Zap color='#f59e0b' size={12} strokeWidth={2.5} />
              <Text style={styles.badgeText}>Focus on</Text>
            </View>
            <Text style={styles.progress}>
              {completedCount}/{totalCount}
            </Text>
          </View>

          <View style={styles.habitRow}>
            <Text style={styles.habitIcon}>{habit.icon || '📝'}</Text>
            <View style={styles.habitInfo}>
              <Text numberOfLines={1} style={styles.habitName}>
                {habit.name}
              </Text>
              <Text style={styles.habitHint}>Tap to mark complete</Text>
            </View>
            <ArrowRight color='#a8a29e' size={20} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#b45309',
    fontSize: 12,
    fontWeight: '600',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  content: {
    padding: 16,
  },
  // Completed state
  completedContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    marginVertical: 8,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecfdf5',
  },

  glow: {
    backgroundColor: '#f59e0b',
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },

  completedEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },

  habitHint: {
    color: '#a8a29e',
    fontSize: 13,
  },

  completedSubtitle: {
    color: '#059669',
    fontSize: 14,
  },

  habitIcon: {
    fontSize: 32,
  },

  completedTitle: {
    color: '#065f46',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },

  habitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },

  habitInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitName: {
    color: '#1c1917',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  progress: {
    fontSize: 13,
    color: '#a8a29e',
    fontWeight: '500',
  },
});

export default NextHabitSuggestion;
