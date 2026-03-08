/**
 * InsightsSections - Weekly insights and habit rankings sections
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { useThemeColors } from '../../../theme/ThemeContext';
import WeeklyInsightsCard from '../../../components/WeeklyInsightsCard';
import HabitRankingsList from '../../../components/HabitRankingsList';
import type { WeeklyInsights } from '../AnalyticsScreen.types';
import type { RankedHabit } from '../AnalyticsScreen.types';

interface InsightsSectionsProps {
  weeklyInsights: WeeklyInsights | undefined;
  rankedHabits: RankedHabit[];
  onHabitPress: (habitId: string) => void;
}

export const InsightsSections: React.FC<InsightsSectionsProps> = ({
  weeklyInsights,
  rankedHabits,
  onHabitPress,
}) => {
  const { colors } = useThemeColors();

  return (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Weekly Insights
        </Text>
        <WeeklyInsightsCard
          insights={weeklyInsights ?? null}
          onArchivePress={() => {
            /* TODO */
          }}
          onHabitPress={onHabitPress}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habit Rankings</Text>
        <HabitRankingsList
          habits={rankedHabits.map((h) => ({
            id: h.id,
            name: h.name,
            emoji: h.emoji ?? '',
            strength: h.strength,
            currentStreak: h.currentStreak ?? 0,
            longestStreak: h.longestStreak ?? 0,
            isAtRisk: h.isAtRisk ?? false,
          }))}
          onHabitPress={onHabitPress}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
});
