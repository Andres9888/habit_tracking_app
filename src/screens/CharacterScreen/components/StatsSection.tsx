import { View, StyleSheet } from 'react-native';
import { StatCard } from './StatCard';
import { spacing } from '../../../theme/spacing';
import type { CharacterStats } from '../types';
import { durations } from '@/theme/animations';

interface StatsSectionProps {
  stats: CharacterStats;
}

const STAGGER_DELAY = durations.stagger;
const BASE_DELAY = 8 * durations.stagger;

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <View style={styles.row}>
      <StatCard
        delay={BASE_DELAY}
        emoji='🔥'
        label='Day Streak'
        value={stats.dayStreak}
      />
      <StatCard
        delay={BASE_DELAY + STAGGER_DELAY}
        emoji='⚡'
        label='Total Power'
        value={stats.totalPower}
      />
      <StatCard
        delay={BASE_DELAY + STAGGER_DELAY * 2}
        emoji='🎯'
        label='Active Habits'
        value={stats.activeHabits}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
});
