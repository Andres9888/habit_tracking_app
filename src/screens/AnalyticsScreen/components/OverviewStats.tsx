/**
 * OverviewStats - Grid of stat cards showing key metrics
 * Each card enters with individual staggered spring animations for premium feel.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import { durations, springs } from '../../../theme/animations';
import { StatCard } from './StatCard';
import type { AnalyticsOverviewStats } from '../AnalyticsScreen.types';

interface OverviewStatsProps {
  stats: AnalyticsOverviewStats | undefined;
  isLoading: boolean;
  onHabitPress: (habitId: string) => void;
}

const formatStrengthPercentage = (strength: number) =>
  `${Math.round(strength)}%`;

const cardAnim = (index: number) =>
  FadeInUp.delay(index * durations.stagger)
    .springify()
    .damping(springs.gentle.damping)
    .stiffness(springs.gentle.stiffness);

export const OverviewStats: React.FC<OverviewStatsProps> = ({
  stats,
  isLoading,
  onHabitPress,
}) => {
  return (
    <View style={styles.statsGrid}>
      <Animated.View entering={cardAnim(0)} style={styles.cardWrapper}>
        <StatCard
          accentColor="#059669"
          animateValue
          loading={isLoading}
          title="Total Habits"
          value={stats?.totalHabits ?? '-'}
        />
      </Animated.View>
      <Animated.View entering={cardAnim(1)} style={styles.cardWrapper}>
        <StatCard
          accentColor="#0891b2"
          animateValue
          loading={isLoading}
          title="Average Strength"
          value={stats ? formatStrengthPercentage(stats.averageStrength) : '-'}
        />
      </Animated.View>
      <Animated.View entering={cardAnim(2)} style={styles.cardWrapper}>
        <StatCard
          accentColor="#7c3aed"
          emoji={stats?.strongestHabit?.emoji}
          loading={isLoading}
          subtitle={
            stats
              ? formatStrengthPercentage(stats.strongestHabit?.strength ?? 0)
              : undefined
          }
          title="Strongest Habit"
          value={stats?.strongestHabit?.name ?? '-'}
          onPress={
            stats?.strongestHabit
              ? () => onHabitPress(stats.strongestHabit!.id)
              : undefined
          }
        />
      </Animated.View>
      <Animated.View entering={cardAnim(3)} style={styles.cardWrapper}>
        <StatCard
          accentColor="#dc2626"
          emoji={stats?.weakestHabit?.emoji}
          loading={isLoading}
          subtitle={
            stats
              ? formatStrengthPercentage(stats.weakestHabit?.strength ?? 0)
              : undefined
          }
          title="Weakest Habit"
          value={stats?.weakestHabit?.name ?? '-'}
          onPress={
            stats?.weakestHabit
              ? () => onHabitPress(stats.weakestHabit!.id)
              : undefined
          }
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    minWidth: '45%',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
});
