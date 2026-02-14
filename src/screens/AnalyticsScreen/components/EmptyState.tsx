/**
 * EmptyState - Theme-aware empty state for analytics screen
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart3, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const EmptyState: React.FC = () => {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <Animated.View
        entering={anim(0)}
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDark ? '#2E1065' : '#EDE9FE',
            shadowColor: '#8b5cf6',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 16,
          },
        ]}
      >
        <BarChart3 color='#8b5cf6' size={48} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={anim(50)}
        style={[styles.title, { color: colors.text.primary }]}
      >
        No Analytics Yet
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(100)}
        style={[styles.description, { color: colors.text.secondary }]}
      >
        Create habits and track them for a few days to unlock your insights
        dashboard.
      </Animated.Text>

      {/* Steps Card */}
      <Animated.View
        entering={anim(150)}
        style={[
          styles.stepsCard,
          {
            backgroundColor: colors.surface,
            shadowColor: isDark ? '#000000' : '#1c1917',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 16,
          },
        ]}
      >
        <View style={styles.stepsHeader}>
          <Sparkles color='#f59e0b' size={16} />
          <Text style={styles.stepsLabel}>GET STARTED</Text>
        </View>
        <View style={styles.stepsList}>
          <StepItem colors={colors} number='1' text='Go to Home tab' />
          <StepItem colors={colors} number='2' text='Create your first habit' />
          <StepItem colors={colors} number='3' text='Track it daily' />
          <StepItem colors={colors} number='4' text='Come back to see insights!' />
        </View>
      </Animated.View>
    </View>
  );
};

function StepItem({
  number,
  text,
  colors,
}: {
  number: string;
  text: string;
  colors: ReturnType<typeof import('../../../theme/ThemeContext').useThemeColors>['colors'];
}) {
  return (
    <View style={styles.stepItem}>
      <View style={[styles.stepNumber, { backgroundColor: colors.gray[100] }]}>
        <Text style={[styles.stepNumberText, { color: colors.text.secondary }]}>
          {number}
        </Text>
      </View>
      <Text style={[styles.stepText, { color: colors.text.primary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 48,
  },
  description: {
    fontSize: 17,
    letterSpacing: -0.41,
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 24,
    height: 96,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 96,
  },
  stepItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 17,
  },
  stepsCard: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  stepsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  stepsLabel: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '600',
  },
  stepsList: {
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
});
