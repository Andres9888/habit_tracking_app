/**
 * PersonalizedInsights - Smart insights cards for the analytics screen
 *
 * Displays 2-3 data-driven insights based on user habit patterns:
 * - Best day analysis
 * - Pattern detection
 * - Trend analysis
 * - Habit stacking suggestions
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius, shadows } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';

/** Insight shape returned by the analyticsInsights query */
interface Insight {
  id: string;
  type: 'best-day' | 'pattern' | 'trend' | 'habit-stack';
  icon: string;
  title: string;
  description: string;
  priority: number;
}

/** Accent colors mapped to insight types (works in both light and dark) */
const INSIGHT_ACCENTS: Record<string, { bg: string; border: string }> = {
  'best-day': { bg: '#EFF6FF', border: '#3B82F6' },
  pattern: { bg: '#FFF7ED', border: '#F59E0B' },
  trend: { bg: '#ECFDF5', border: '#059669' },
  'habit-stack': { bg: '#F5F3FF', border: '#7C3AED' },
};

const INSIGHT_ACCENTS_DARK: Record<string, { bg: string; border: string }> = {
  'best-day': { bg: 'rgba(59,130,246,0.12)', border: '#60A5FA' },
  pattern: { bg: 'rgba(245,158,11,0.12)', border: '#FBBF24' },
  trend: { bg: 'rgba(5,150,105,0.12)', border: '#34D399' },
  'habit-stack': { bg: 'rgba(124,58,237,0.12)', border: '#A78BFA' },
};

export const PersonalizedInsights: React.FC = () => {
  const { colors, isDark } = useThemeColors();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const insightsQuery = (api as any).analyticsInsights
    ?.getPersonalizedInsights;
  const insights = useQuery(
    insightsQuery ?? api.analytics.getOverviewStats
  ) as Insight[] | undefined;

  // If the query isn't available yet (codegen not run), insights will be undefined
  const validInsights =
    insightsQuery && insights && Array.isArray(insights) ? insights : null;

  if (!validInsights || validInsights.length === 0) return null;

  const accents = isDark ? INSIGHT_ACCENTS_DARK : INSIGHT_ACCENTS;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Insights For You
      </Text>
      {validInsights.map((insight: Insight, index: number) => {
        const accent = accents[insight.type] ?? accents['trend'];
        return (
          <Animated.View
            key={insight.id}
            entering={FadeInDown.delay(280 + index * 60)
              .springify()
              .damping(18)}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: accent.bg,
                  borderLeftColor: accent.border,
                },
                isDark && styles.cardDark,
              ]}
            >
              <Text style={styles.icon}>{insight.icon}</Text>
              <View style={styles.textContainer}>
                <Text
                  style={[styles.title, { color: colors.text.primary }]}
                >
                  {insight.title}
                </Text>
                <Text
                  style={[
                    styles.description,
                    { color: colors.text.secondary },
                  ]}
                >
                  {insight.description}
                </Text>
              </View>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderLeftWidth: 3,
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    marginBottom: spacing.sm,
    padding: spacing.base,
    ...shadows.card,
  },
  cardDark: {
    shadowOpacity: 0,
    elevation: 0,
  },
  container: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  description: {
    ...typography.bodySmall,
    lineHeight: 20,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  sectionTitle: {
    ...typography.heading3,
    marginBottom: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.labelLarge,
    marginBottom: spacing.xs,
  },
});
