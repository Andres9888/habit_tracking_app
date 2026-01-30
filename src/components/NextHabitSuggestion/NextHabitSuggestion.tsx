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
          {totalCount} habit{totalCount !== 1 ? 's' : ''} completed
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
              <Zap size={12} color="#f59e0b" strokeWidth={2.5} />
              <Text style={styles.badgeText}>Focus on</Text>
            </View>
            <Text style={styles.progress}>
              {completedCount}/{totalCount}
            </Text>
          </View>

          <View style={styles.habitRow}>
            <Text style={styles.habitIcon}>{habit.icon || '📝'}</Text>
            <View style={styles.habitInfo}>
              <Text style={styles.habitName} numberOfLines={1}>
                {habit.name}
              </Text>
              <Text style={styles.habitHint}>
                Tap to mark complete
              </Text>
            </View>
            <ArrowRight size={20} color="#a8a29e" />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#f59e0b',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b45309',
  },
  progress: {
    fontSize: 13,
    fontWeight: '500',
    color: '#a8a29e',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitIcon: {
    fontSize: 32,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1917',
    marginBottom: 2,
  },
  habitHint: {
    fontSize: 13,
    color: '#a8a29e',
  },
  // Completed state
  completedContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
  },
  completedEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  completedTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 4,
  },
  completedSubtitle: {
    fontSize: 14,
    color: '#059669',
  },
});

export default NextHabitSuggestion;
