/**
 * OverviewStats - Grid of stat cards showing key metrics
 * Theme-aware with trend indicators and staggered animations
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { StatCard } from './StatCard';
import type { AnalyticsOverviewStats } from '../AnalyticsScreen.types';

interface OverviewStatsProps {
  stats: AnalyticsOverviewStats | undefined;
  isLoading: boolean;
  onHabitPress: (habitId: string) => void;
}

const formatStrengthPercentage = (strength: number) =>
  `${Math.round(strength)}%`;

/**
 * Derive a simple trend from the strength value:
 * ≥ 60% → up, ≤ 30% → down, else null
 */
function deriveTrend(strength: number | undefined): 'up' | 'down' | null {
  if (strength == null) return null;
  if (strength >= 60) return 'up';
  if (strength <= 30) return 'down';
  return null;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({
  stats,
  isLoading,
  onHabitPress,
}) => {
  return (
    <View style={styles.statsGrid}>
      <StatCard
        index={0}
        loading={isLoading}
        title='Total Habits'
        value={stats?.totalHabits ?? '-'}
      />
      <StatCard
        index={1}
        loading={isLoading}
        title='Average Strength'
        trend={deriveTrend(stats?.averageStrength)}
        value={stats ? formatStrengthPercentage(stats.averageStrength) : '-'}
      />
      <StatCard
        emoji={stats?.strongestHabit?.emoji}
        index={2}
        loading={isLoading}
        subtitle={
          stats
            ? formatStrengthPercentage(stats.strongestHabit?.strength ?? 0)
            : undefined
        }
        title='Strongest Habit'
        trend='up'
        value={stats?.strongestHabit?.name ?? '-'}
        onPress={
          stats?.strongestHabit
            ? () => onHabitPress(stats.strongestHabit!.id)
            : undefined
        }
      />
      <StatCard
        emoji={stats?.weakestHabit?.emoji}
        index={3}
        loading={isLoading}
        subtitle={
          stats
            ? formatStrengthPercentage(stats.weakestHabit?.strength ?? 0)
            : undefined
        }
        title='Needs Attention'
        trend='down'
        value={stats?.weakestHabit?.name ?? '-'}
        onPress={
          stats?.weakestHabit
            ? () => onHabitPress(stats.weakestHabit!.id)
            : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
});
