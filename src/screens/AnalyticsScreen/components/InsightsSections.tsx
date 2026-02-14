/**
 * InsightsSections - Weekly insights, habit rankings, and personalized insights sections
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import WeeklyInsightsCard from '../../../components/WeeklyInsightsCard';
import HabitInsightsCard from '../../../components/HabitInsightsCard';
import HabitRankingsList from '../../../components/HabitRankingsList';
import type { WeeklyInsights, HabitInsightsResult } from '../AnalyticsScreen.types';
import type { RankedHabit } from '../AnalyticsScreen.types';

interface InsightsSectionsProps {
  weeklyInsights: WeeklyInsights | undefined;
  habitInsights: HabitInsightsResult | undefined;
  rankedHabits: RankedHabit[];
  onHabitPress: (habitId: string) => void;
  isPremiumUser?: boolean;
  onUnlockInsights?: () => void;
}

export const InsightsSections: React.FC<InsightsSectionsProps> = ({
  weeklyInsights,
  habitInsights,
  rankedHabits,
  onHabitPress,
  isPremiumUser = false,
  onUnlockInsights,
}) => {
  return (
    <>
      {/* Personalized Habit Insights - Premium Feature */}
      <View style={styles.section}>
        <HabitInsightsCard
          insights={habitInsights ?? null}
          isPremiumUser={isPremiumUser}
          onUnlockPress={onUnlockInsights}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Insights</Text>
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
