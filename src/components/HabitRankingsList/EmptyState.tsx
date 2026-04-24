/**
 * HabitRankingsList EmptyState
 * Design-system compliant: StyleSheet, themed colors, FadeInUp animation
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListOrdered } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { enterEasing } from '../../theme/animations';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).easing(enterEasing);

export function EmptyState() {
  return (
    <View
      accessible
      accessibilityLabel='No habits to rank yet'
      accessibilityRole='text'
      style={styles.container}
    >
      <Animated.View entering={anim(0)} style={styles.iconContainer}>
        <ListOrdered color={colors.primary[600]} size={40} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text entering={anim(60)} style={styles.title}>
        No Habits to Rank Yet
      </Animated.Text>
      <Animated.Text entering={anim(120)} style={styles.description}>
        Complete some habits to see your rankings here
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    maxWidth: 280,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.large,
    height: 80,
    justifyContent: 'center',
    marginBottom: spacing.base,
    width: 80,
    ...shadows.card,
  },
  title: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
