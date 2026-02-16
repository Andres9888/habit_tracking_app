/* eslint-disable max-lines */
/**
 * EmptyState - Shown when user has no habits to analyze
 * Uses design system tokens (no hardcoded colors or NativeWind)
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius, shadows } from '../../../theme/spacing';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const EmptyState: React.FC = () => {
  return (
    <View
      accessible
      accessibilityLabel="No analytics data yet. Create habits and track them to see insights."
      accessibilityRole="text"
      style={emptyStyles.container}
    >
      {/* Illustration */}
      <Animated.View entering={anim(0)} style={emptyStyles.iconContainer}>
        <Ionicons color={colors.primary[500]} name="bar-chart-outline" size={48} />
      </Animated.View>

      {/* Title */}
      <Animated.Text entering={anim(50)} style={emptyStyles.title}>
        No Analytics Yet
      </Animated.Text>

      {/* Description */}
      <Animated.Text entering={anim(100)} style={emptyStyles.description}>
        Create habits and track them for a few days to unlock your insights
        dashboard.
      </Animated.Text>

      {/* Steps Card */}
      <Animated.View entering={anim(150)} style={emptyStyles.stepsCard}>
        <View style={emptyStyles.stepsHeader}>
          <Ionicons color={colors.streak[500]} name="sparkles" size={16} />
          <Text style={emptyStyles.stepsLabel}>GET STARTED</Text>
        </View>
        <View style={emptyStyles.stepsList}>
          <StepItem number="1" text="Go to Home tab" />
          <StepItem number="2" text="Create your first habit" />
          <StepItem number="3" text="Track it daily" />
          <StepItem number="4" text="Come back to see insights!" />
        </View>
      </Animated.View>
    </View>
  );
};

function StepItem({ number, text }: { number: string; text: string }) {
  return (
    <View accessibilityLabel={`Step ${number}: ${text}`} style={emptyStyles.stepRow}>
      <View style={emptyStyles.stepBadge}>
        <Text style={emptyStyles.stepNumber}>{number}</Text>
      </View>
      <Text style={emptyStyles.stepText}>{text}</Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    maxWidth: 280,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.xl,
    height: 96,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 96,
    ...shadows.card,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    padding: spacing.base,
    width: '100%',
    ...shadows.card,
  },
  stepsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  stepsLabel: {
    ...typography.caption,
    color: colors.streak[500],
    fontWeight: '600',
  },
  stepsList: {
    gap: spacing.md,
  },
  stepRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepBadge: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  stepNumber: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  stepText: {
    ...typography.body,
    color: colors.text.primary,
  },
  title: {
    ...typography.heading2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
