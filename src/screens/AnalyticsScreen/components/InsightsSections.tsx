/**
 * InsightsSections - Weekly insights and habit rankings sections
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import WeeklyInsightsCard from '../../../components/WeeklyInsightsCard';
import HabitRankingsList from '../../../components/HabitRankingsList';

interface InsightsSectionsProps {
  weeklyInsights: any;
  rankedHabits: any[];
  onHabitPress: (habitId: string) => void;
}

export const InsightsSections: React.FC<InsightsSectionsProps> = ({
  weeklyInsights,
  rankedHabits,
  onHabitPress,
}) => {
  return (
    <>
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
        <HabitRankingsList habits={rankedHabits} onHabitPress={onHabitPress} />
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
