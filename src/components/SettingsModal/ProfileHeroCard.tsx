/** ProfileHeroCard — centered avatar, name, and stats (Habit It-inspired) */
import { Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontWeights } from '../../theme/typography';
import { getProfileCardShellStyle } from './profileCardShellStyle';
import { ProfilePremiumBadge } from './ProfilePremiumBadge';
import { ProfileStatsRow } from './ProfileStatsRow';
import { UserAvatar } from './UserAvatar';
import { useProfileDisplayImage } from './useProfileDisplayImage';
import { useProfileDisplayName } from './useProfileDisplayName';
import { useProfileStats } from './useProfileStats';

interface ProfileHeroCardProps {
  highContrastMode: boolean;
  isPremium: boolean;
  onPress: () => void;
}

export function ProfileHeroCard({
  highContrastMode,
  isPremium,
  onPress,
}: ProfileHeroCardProps) {
  const { colors: themeColors } = useThemeColors();
  const { initial, name } = useProfileDisplayName();
  const { isLoading: statsLoading, stats } = useProfileStats();
  const { imageUrl } = useProfileDisplayImage();

  return (
    <AnimatedPressable
      accessibilityLabel='Account settings'
      accessibilityRole='button'
      onPress={onPress}
    >
      <View
        className='overflow-hidden rounded-2xl'
        style={getProfileCardShellStyle(highContrastMode, themeColors)}
      >
        <View className='items-center px-4 pb-1 pt-5'>
          <View className='absolute right-3 top-3'>
            <ChevronRight
              color={themeColors.text.tertiary}
              size={iconSizes.medium}
            />
          </View>
          <UserAvatar
            imageUrl={imageUrl}
            initial={initial}
            palette={{
              avatarBg: themeColors.primary[100],
              avatarBorderColor: themeColors.border,
              avatarBorderWidth: 2,
              avatarTextColor: themeColors.primary[700],
              gradientColors: [
                themeColors.primary[700],
                themeColors.primary[600],
              ],
            }}
            size={72}
            useGradient
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
        <ProfileStatsRow
          highContrastMode={highContrastMode}
          isLoading={statsLoading}
          stats={stats}
        />
      </View>
    </AnimatedPressable>
  );
}
