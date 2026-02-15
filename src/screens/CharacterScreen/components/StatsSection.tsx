import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { StatCard } from './StatCard';
import type { CharacterStats } from '../types';

interface StatsSectionProps {
  stats: CharacterStats;
}

const STAGGER_DELAY = 60;
const BASE_DELAY = 480;

export function StatsSection({ stats }: StatsSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel={`Stats: ${stats.dayStreak} day streak, ${stats.totalPower} total power, ${stats.activeHabits} active habits`}
      accessibilityRole="none"
      style={{ marginBottom: 24, gap: 12 }}
    >
      <Animated.Text
        accessibilityRole="header"
        entering={FadeInDown.delay(BASE_DELAY - 60).springify().damping(18)}
        style={{ paddingHorizontal: 4, fontWeight: '600', fontSize: 17, letterSpacing: -0.41, lineHeight: 22, color: colors.text.primary }}
      >
        Stats
      </Animated.Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
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
    </View>
  );
}
