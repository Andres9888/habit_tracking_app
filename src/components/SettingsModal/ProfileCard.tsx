/** ProfileCard — left-aligned account hero: identity + streak + edit, then stats */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography, fontWeights } from '../../theme/typography';
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';
import { EditableUserAvatar } from './EditableUserAvatar';
import { getProfileCardShellStyle } from './profileCardShellStyle';
import { ProfilePremiumBadge } from './ProfilePremiumBadge';
import { ProfileStatsRow } from './ProfileStatsRow';
import { useChangeProfileImage } from './useChangeProfileImage';
import { useProfileDisplayImage } from './useProfileDisplayImage';
import { useProfileDisplayName } from './useProfileDisplayName';
import { useProfileStats } from './useProfileStats';

interface ProfileCardProps {
  isPremium: boolean;
}

export function ProfileCard({ isPremium }: ProfileCardProps) {
  const { colors: themeColors } = useThemeColors();
  const { email, initial, name } = useProfileDisplayName();
  const { isLoading: statsLoading, stats } = useProfileStats();
  const { imageUrl } = useProfileDisplayImage();
  const { isUpdating, openPhotoPicker } = useChangeProfileImage();

  return (
    <View
      className='overflow-hidden rounded-2xl'
      style={getProfileCardShellStyle(themeColors)}
    >
      <View
        className='flex-row items-center px-4 pb-3 pt-4'
        style={{ gap: 16 }}
      >
        <EditableUserAvatar
          imageUrl={imageUrl}
          initial={initial}
          isUpdating={isUpdating}
          palette={{
            avatarBg: themeColors.primary[700],
            avatarBorderColor: themeColors.border,
            avatarBorderWidth: 0,
            avatarTextColor: themeColors.text.inverse,
            gradientColors: [
              themeColors.primary[700],
              themeColors.primary[600],
            ],
          }}
          size={64}
          useGradient
          onPress={openPhotoPicker}
        />
        <View className='flex-1'>
          <View className='flex-row items-center' style={{ gap: 6 }}>
            <Text
              numberOfLines={1}
              style={{
                ...typography.heading3,
                color: themeColors.text.primary,
              }}
            >
              {name}
            </Text>
            {isPremium ? <ProfilePremiumBadge variant='compact' /> : null}
          </View>
          {email ? (
            <Text
              className='mt-0.5'
              numberOfLines={1}
              style={{
                ...typography.bodySmall,
                color: themeColors.text.secondary,
              }}
            >
              {email}
            </Text>
          ) : null}
          <View className='mt-2 flex-row items-center' style={{ gap: 5 }}>
            {statsLoading ? (
              <SkeletonLoader borderRadius={6} height={16} width={96} />
            ) : (
              <>
                <Text style={{ fontSize: 13 }}>🔥</Text>
                <Text
                  style={{
                    ...typography.bodySmall,
                    fontWeight: fontWeights.bold,
                    color: themeColors.status.streakText,
                  }}
                >
                  {stats.currentStreak}-day streak
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
      <ProfileStatsRow isLoading={statsLoading} stats={stats} />
    </View>
  );
}
