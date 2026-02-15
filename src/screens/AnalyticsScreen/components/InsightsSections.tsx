/**
 * InsightsSections - Weekly insights and habit rankings sections
 * Theme-aware with dark mode support
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { spacing } from '../../../theme/spacing';
import WeeklyInsightsCard from '../../../components/WeeklyInsightsCard';
import HabitRankingsList from '../../../components/HabitRankingsList';
import type { WeeklyInsights } from '../AnalyticsScreen.types';
import type { RankedHabit } from '../AnalyticsScreen.types';

interface InsightsSectionsProps {
  weeklyInsights: WeeklyInsights | undefined;
  rankedHabits: RankedHabit[];
  onHabitPress: (habitId: string) => void;
}

const anim = (delay: number) => FadeInUp.delay(delay).springify().damping(18);

export const InsightsSections: React.FC<InsightsSectionsProps> = ({
  weeklyInsights,
  rankedHabits,
  onHabitPress,
}) => {
  const { colors: tc } = useThemeColors();

  const sectionTitleStyle = {
    color: tc.text.primary,
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    marginBottom: spacing.md,
  };

  return (
    <>
      <Animated.View entering={anim(0)} style={styles.section}>
        <Text style={sectionTitleStyle}>Weekly Insights</Text>
        <WeeklyInsightsCard
          insights={weeklyInsights ?? null}
          onArchivePress={() => {
            /* TODO */
          }}
          onHabitPress={onHabitPress}
        />
      </Animated.View>

      <Animated.View entering={anim(60)} style={styles.section}>
        <Text style={sectionTitleStyle}>Habit Rankings</Text>
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
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
