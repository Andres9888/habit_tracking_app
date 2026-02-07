/**
 * OverviewStats - Grid of stat cards showing key metrics
 * OPTIMIZED: FadeInUp stagger animations
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
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

const anim = (delay: number) => FadeInUp.delay(delay).springify().damping(18);

export const OverviewStats: React.FC<OverviewStatsProps> = ({
  stats,
  isLoading,
  onHabitPress,
}) => {
  return (
    <Animated.View entering={anim(0)} style={styles.statsGrid}>
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
        onPress={
          stats?.strongestHabit
            ? () => onHabitPress(stats.strongestHabit!.id)
            : undefined
        }
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
        onPress={
          stats?.weakestHabit
            ? () => onHabitPress(stats.weakestHabit!.id)
            : undefined
        }
      />
    </Animated.View>
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
