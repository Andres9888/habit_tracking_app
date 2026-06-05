/** ProfileStatsRow — Habit It-style three-column stats strip */
import { View } from 'react-native';
import { Activity, CheckCircle2, Star } from 'lucide-react-native';
import { ProfileStatItem } from './ProfileStatItem';
import type { ProfileStats } from './profileStats.types';

interface ProfileStatsRowProps {
  stats: ProfileStats;
}

const STAT_COLORS = {
  activeHabits: '#EA580C',
  flawlessDays: '#16A34A',
  lifetimeCompletions: '#2563EB',
} as const;

export function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
  return (
    <View className='flex-row border-t px-2 py-4' style={{ borderTopColor: 'rgba(0,0,0,0.06)' }}>
      <ProfileStatItem
        color={STAT_COLORS.activeHabits}
        icon={Activity}
        label='Active Habits'
        value={stats.activeHabits}
      />
      <ProfileStatItem
        color={STAT_COLORS.flawlessDays}
        icon={Star}
        label='Flawless Days'
        showDivider
        value={stats.flawlessDays}
      />
      <ProfileStatItem
        color={STAT_COLORS.lifetimeCompletions}
        icon={CheckCircle2}
        label='Lifetime Completions'
        showDivider
        value={stats.lifetimeCompletions}
      />
    </View>
  );
}
