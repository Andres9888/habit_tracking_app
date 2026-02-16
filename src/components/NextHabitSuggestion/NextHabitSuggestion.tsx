/* eslint-disable max-lines */
/**
 * NextHabitSuggestion Component
 * Shows the next incomplete habit to focus on
 * Reduces decision fatigue by highlighting one habit at a time
 * Theme-aware with dark mode support
 */

import React from 'react';
import { Pressable } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ArrowRight, Zap } from 'lucide-react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import type { NextHabitSuggestionProps } from './types';
import { CompletedState } from './CompletedState';
import { HabitContent } from './HabitContent';

export function NextHabitSuggestion({
  habit,
  onPress,
  completedCount,
  totalCount,
}: NextHabitSuggestionProps) {
  const { colors, isDark } = useThemeColors();
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
      <View
        style={[
          styles.completedContainer,
          {
            backgroundColor: isDark ? colors.primary[100] : '#ecfdf5',
          },
        ]}
      >
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text
          style={[
            styles.completedTitle,
            { color: isDark ? colors.primary[500] : '#065f46' },
          ]}
        >
          All done for today!
        </Text>
        <Text
          style={[
            styles.completedSubtitle,
            { color: isDark ? colors.primary[400] : '#059669' },
          ]}
        >
          {totalCount} habit{totalCount === 1 ? '' : 's'} completed
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityHint='Double tap to open this habit'
      accessibilityLabel={`Next habit: ${habit.name ?? 'habit'}`}
      accessibilityRole='button'
      onPress={() => onPress?.(habit)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          cardStyle,
          {
            backgroundColor: colors.card,
            shadowColor: isDark ? '#000' : '#000',
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View style={[styles.glow, glowStyle]} />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isDark ? '#78350f' : '#fef3c7',
                },
              ]}
            >
              <Zap color="#f59e0b" size={12} strokeWidth={2.5} />
              <Text
                style={[
                  styles.badgeText,
                  { color: isDark ? '#fbbf24' : '#b45309' },
                ]}
              >
                Focus on
              </Text>
            </View>
            <Text style={[styles.progress, { color: colors.text.tertiary }]}>
              {completedCount}/{totalCount}
            </Text>
          </View>

          <View style={styles.habitRow}>
            <Text style={styles.habitIcon}>{habit.icon || '📝'}</Text>
            <View style={styles.habitInfo}>
              <Text
                numberOfLines={1}
                style={[styles.habitName, { color: colors.text.primary }]}
              >
                {habit.name}
              </Text>
              <Text style={[styles.habitHint, { color: colors.text.tertiary }]}>
                Tap to mark complete
              </Text>
            </View>
            <ArrowRight color={colors.text.tertiary} size={20} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedContainer: {
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
  },
  completedEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 14,
  },
  completedTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  container: {
    borderRadius: 16,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  content: {
    padding: 16,
  },
  glow: {
    backgroundColor: '#f59e0b',
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  habitHint: {
    fontSize: 13,
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
    marginBottom: 2,
  },
  habitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progress: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default NextHabitSuggestion;
