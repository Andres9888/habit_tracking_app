/** ProfileHeroCard — identity, streak headline, and weekly-consistency ring */
import { View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { airy } from '@/theme/airyScale';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
import { getProfileCardShellStyle } from './profileCardShellStyle';
import { ProfileStatsRow } from './ProfileStatsRow';
import { WeeklyCompletionRing } from './WeeklyCompletionRing';
import { ProfileHeroAvatar } from './components/ProfileHeroAvatar';
import { ProfileHeroIdentity } from './components/ProfileHeroIdentity';
import { useProfileDisplayImage } from './useProfileDisplayImage';
import { useProfileDisplayName } from './useProfileDisplayName';
import { useProfileStats } from './useProfileStats';

interface ProfileHeroCardProps {
  isPremium: boolean;
  onPress: () => void;
}

export function ProfileHeroCard({ isPremium, onPress }: ProfileHeroCardProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const { initial, name } = useProfileDisplayName();
  const { isLoading: statsLoading, stats } = useProfileStats();
  const { imageUrl } = useProfileDisplayImage();

  return (
    <AnimatedPressable
      accessibilityLabel='Account settings'
      accessibilityRole='button'
      animationConfig={{ hapticStyle: 'light' }}
      onPress={onPress}
    >
      <View
        className='overflow-hidden rounded-2xl'
        style={[
          getProfileCardShellStyle(themeColors, isDark),
          { borderRadius: airy.cardRadius },
        ]}
      >
        <View className='absolute right-3 top-3'>
          <ChevronRight
            color={themeColors.text.tertiary}
            size={iconSizes.medium}
          />
        </View>
        <View
          className='flex-row items-center px-4 pb-3 pt-4'
          style={{ gap: 16 }}
        >
          <ProfileHeroAvatar
            imageUrl={imageUrl}
            initial={initial}
            themeColors={themeColors}
          />
          <ProfileHeroIdentity
            currentStreak={stats.currentStreak}
            isPremium={isPremium}
            name={name}
          />
          {stats.activeHabits > 0 ? (
            <View style={{ marginRight: 14 }}>
              <WeeklyCompletionRing rate={stats.weeklyCompletionRate} />
            </View>
          ) : null}
        </View>
        <ProfileStatsRow isLoading={statsLoading} stats={stats} />
      </View>
    </AnimatedPressable>
  );
}
