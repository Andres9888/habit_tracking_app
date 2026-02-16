/**
 * OverviewStats - Grid of stat cards showing key metrics
 * OPTIMIZED: FadeInUp stagger animations
 */
import React, { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { StatCard } from './StatCard';
import type { AnalyticsOverviewStats, NPSAnalytics } from '../AnalyticsScreen.types';

interface OverviewStatsProps {
  stats: AnalyticsOverviewStats | undefined;
  isLoading: boolean;
  npsAnalytics: NPSAnalytics | undefined | null;
  onHabitPress: (habitId: string) => void;
}

const formatStrengthPercentage = (strength: number) =>
  `${Math.round(strength)}%`;

const formatNPSScore = (score: number | null) => {
  if (score === null) return 'N/A';
  return score > 0 ? `+${score}` : `${score}`;
};

const getNPSEmoji = (score: number | null) => {
  if (score === null) return '📊';
  if (score >= 50) return '🚀'; // Excellent
  if (score >= 20) return '👍'; // Good
  if (score >= 0) return '😐'; // Neutral
  return '⚠️'; // Needs improvement
};

export const OverviewStats = memo(function OverviewStats({
  stats,
  isLoading,
  npsAnalytics,
  onHabitPress,
}: OverviewStatsProps) {
  const handleStrongestPress = useCallback(() => {
    if (stats?.strongestHabit) {
      onHabitPress(stats.strongestHabit.id);
    }
  }, [stats?.strongestHabit, onHabitPress]);

  const handleWeakestPress = useCallback(() => {
    if (stats?.weakestHabit) {
      onHabitPress(stats.weakestHabit.id);
    }
  }, [stats?.weakestHabit, onHabitPress]);

  return (
    <View
      accessible={false}
      accessibilityLabel='Overview statistics'
      accessibilityRole='summary'
      style={styles.statsGrid}
    >
      <StatCard
        loading={isLoading}
        title='Total Habits'
        value={stats?.totalHabits ?? '-'}
      />
      <StatCard
        loading={isLoading}
        title='Average Strength'
        value={stats ? formatStrengthPercentage(stats.averageStrength) : '-'}
      />
      <StatCard
        emoji={stats?.strongestHabit?.emoji}
        loading={isLoading}
        subtitle={
          stats
            ? formatStrengthPercentage(stats.strongestHabit?.strength ?? 0)
            : undefined
        }
        title='Strongest Habit'
        value={stats?.strongestHabit?.name ?? '-'}
        onPress={stats?.strongestHabit ? handleStrongestPress : undefined}
      />
      <StatCard
        emoji={stats?.weakestHabit?.emoji}
        loading={isLoading}
        subtitle={
          stats
            ? formatStrengthPercentage(stats.weakestHabit?.strength ?? 0)
            : undefined
        }
        title='Weakest Habit'
        value={stats?.weakestHabit?.name ?? '-'}
        onPress={stats?.weakestHabit ? handleWeakestPress : undefined}
      />
      {npsAnalytics?.hasResponses && (
        <StatCard
          emoji={getNPSEmoji(npsAnalytics.npsScore)}
          loading={isLoading}
          subtitle={`${npsAnalytics.responseCount} ${npsAnalytics.responseCount === 1 ? 'response' : 'responses'}`}
          title='App Rating (NPS)'
          value={formatNPSScore(npsAnalytics.npsScore)}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
});
