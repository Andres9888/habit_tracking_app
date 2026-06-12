/** ProfileStatsRow — three-column stats strip below profile hero */
import { View } from 'react-native';
import Animated, { FadeIn, useReducedMotion } from 'react-native-reanimated';
import { Activity, CheckCircle2, Star } from 'lucide-react-native';
import { durations, enterEasing } from '@/theme/animations';
import { useThemeColors } from '../../theme/ThemeContext';
import { ProfileStatItem } from './ProfileStatItem';
import { getProfileStatColors } from './getProfileStatColors';
import type { ProfileStats } from './profileStats.types';

interface ProfileStatsRowProps {
  isLoading?: boolean;
  stats: ProfileStats;
}

export function ProfileStatsRow({
  isLoading = false,
  stats,
}: ProfileStatsRowProps) {
  const { colors: themeColors } = useThemeColors();
  const reduceMotion = useReducedMotion();
  const palette = getProfileStatColors(themeColors);

  const content = (
    <View
      className='flex-row px-2 py-4'
      style={{ borderTopColor: palette.borderTop, borderTopWidth: 1 }}
    >
      <ProfileStatItem
        color={palette.activeHabits}
        dividerColor={palette.divider}
        icon={Activity}
        isLoading={isLoading}
        label='Active Habits'
        labelColor={palette.label}
        value={stats.activeHabits}
      />
      <ProfileStatItem
        color={palette.flawlessDays}
        dividerColor={palette.divider}
        icon={Star}
        isLoading={isLoading}
        label='Flawless Days'
        labelColor={palette.label}
        showDivider
        value={stats.flawlessDays}
      />
      <ProfileStatItem
        color={palette.lifetimeCompletions}
        dividerColor={palette.divider}
        icon={CheckCircle2}
        isLoading={isLoading}
        label='Lifetime Completions'
        labelColor={palette.label}
        showDivider
        value={stats.lifetimeCompletions}
      />
    </View>
  );

  if (isLoading || reduceMotion) return content;

  return (
    <Animated.View
      entering={FadeIn.duration(durations.enter).easing(enterEasing)}
    >
      {content}
    </Animated.View>
  );
}
