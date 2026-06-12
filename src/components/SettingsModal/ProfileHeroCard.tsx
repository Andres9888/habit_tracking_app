/** ProfileHeroCard — centered avatar, name, and stats with layered depth */
import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontWeights } from '../../theme/typography';
import { getProfileCardShellStyle } from './profileCardShellStyle';
import { ProfilePremiumBadge } from './ProfilePremiumBadge';
import { ProfileStatsRow } from './ProfileStatsRow';
import { ProfileHeroAvatar } from './components/ProfileHeroAvatar';
import { useProfileDisplayImage } from './useProfileDisplayImage';
import { useProfileDisplayName } from './useProfileDisplayName';
import { useProfileStats } from './useProfileStats';

interface ProfileHeroCardProps {
  isPremium: boolean;
  onPress: () => void;
}

export function ProfileHeroCard({ isPremium, onPress }: ProfileHeroCardProps) {
  const { colors: themeColors } = useThemeColors();
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
        style={getProfileCardShellStyle(themeColors)}
      >
        <View className='items-center px-4 pb-1 pt-5'>
          <View className='absolute right-3 top-3'>
            <ChevronRight
              color={themeColors.text.tertiary}
              size={iconSizes.medium}
            />
          </View>
          <ProfileHeroAvatar
            imageUrl={imageUrl}
            initial={initial}
            themeColors={themeColors}
          />
          <View className='mt-3 flex-row items-center' style={{ gap: 6 }}>
            <Text
              style={{
                ...typography.heading3,
                color: themeColors.text.primary,
                fontWeight: fontWeights.bold,
              }}
            >
              {name}
            </Text>
            {isPremium ? <ProfilePremiumBadge variant='compact' /> : null}
          </View>
        </View>
        <ProfileStatsRow isLoading={statsLoading} stats={stats} />
      </View>
    </AnimatedPressable>
  );
}
