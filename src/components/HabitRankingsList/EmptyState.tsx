/**
 * HabitRankingsList EmptyState
 * ENHANCED: More encouraging, gamification-focused
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel='Start completing habits to see your rankings and compete with yourself!'
      accessibilityRole='text'
      style={styles.container}
    >
      {/* Icon */}
      <Animated.View
        entering={anim(0)}
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDark ? '#451A03' : '#FFFBEB',
            shadowColor: '#f59e0b',
          },
        ]}
      >
        <Trophy color={isDark ? '#FCD34D' : '#F59E0B'} size={40} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={anim(60)}
        style={[
          styles.title,
          { color: colors.text.primary },
        ]}
      >
        Climb the Leaderboard!
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(120)}
        style={[
          styles.description,
          { color: colors.text.secondary },
        ]}
      >
        Complete habits to see your rankings and track which ones you're crushing
      </Animated.Text>

      {/* Motivation Badge */}
      <Animated.View
        entering={anim(180)}
        style={[
          styles.badge,
          {
            backgroundColor: isDark ? '#064E3B' : '#D1FAE5',
          },
        ]}
      >
        <Text style={{ color: isDark ? '#6EE7B7' : '#047857', fontSize: 12, fontWeight: '500' }}>
          🎯 Complete your first habit to start!
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    maxWidth: 280,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    height: 80,
    justifyContent: 'center',
    marginBottom: spacing.base,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 80,
    ...shadows.card,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
