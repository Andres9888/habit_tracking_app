/** ProfileHeroCard — centered avatar, name, and stats (Habit It-inspired) */
import { Text, View } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { ChevronRight, Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
import { shadows } from '../../theme/spacing';
import { typography, fontWeights } from '../../theme/typography';
import { ProfileStatsRow } from './ProfileStatsRow';
import { UserAvatar } from './UserAvatar';
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
  const { user } = useUser();
  const { colors: themeColors } = useThemeColors();
  const stats = useProfileStats();

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'User';
  const initial = name.charAt(0).toUpperCase();
  const imageUrl = user?.imageUrl;

  return (
    <AnimatedPressable
      accessibilityLabel='Account settings'
      accessibilityRole='button'
      onPress={onPress}
    >
      <View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: highContrastMode ? themeColors.card : themeColors.card,
          borderColor: highContrastMode ? themeColors.border : undefined,
          borderWidth: highContrastMode ? 1 : 0,
          ...(highContrastMode ? { elevation: 0, shadowColor: 'transparent' } : shadows.card),
        }}
      >
        <View className='items-center px-4 pb-1 pt-5'>
          <View className='absolute right-3 top-3'>
            <ChevronRight color={themeColors.text.tertiary} size={iconSizes.medium} />
          </View>
          <UserAvatar
            imageUrl={imageUrl}
            initial={initial}
            palette={{
              avatarBg: themeColors.primary[100],
              avatarBorderColor: themeColors.border,
              avatarBorderWidth: 2,
              avatarTextColor: themeColors.primary[700],
              gradientColors: [themeColors.primary[700], themeColors.primary[600]],
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
            {isPremium ? (
              <View
                className='flex-row items-center rounded-md px-1.5 py-0.5'
                style={{ backgroundColor: themeColors.status.warningLight, gap: 3 }}
              >
                <Crown color={themeColors.status.warningText} size={iconSizes.micro} />
                <Text
                  style={{
                    ...typography.tabBar,
                    color: themeColors.status.warningText,
                    fontWeight: fontWeights.bold,
                  }}
                >
                  PRO
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <ProfileStatsRow stats={stats} />
      </View>
    </AnimatedPressable>
  );
}
