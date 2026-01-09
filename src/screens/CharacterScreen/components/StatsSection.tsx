import { View } from 'react-native';
import { StatCard } from './StatCard';
import type { CharacterStats } from '../types';

interface StatsSectionProps {
  stats: CharacterStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <View className='mb-6 flex-row gap-3'>
      <StatCard emoji='🔥' label='Day Streak' value={stats.dayStreak} />
      <StatCard emoji='⚡' label='Total Power' value={stats.totalPower} />
      <StatCard emoji='🎯' label='Active Habits' value={stats.activeHabits} />
    </View>
  );
}
