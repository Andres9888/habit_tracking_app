/** ProfileCard — User identity anchor at top of account page */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
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
  highContrastMode: boolean;
}

export function ProfileCard({ isPremium, highContrastMode }: ProfileCardProps) {
  const { colors: themeColors } = useThemeColors();
  const { email, initial, name } = useProfileDisplayName();
  const { isLoading: statsLoading, stats } = useProfileStats();
  const { imageUrl } = useProfileDisplayImage();
  const { isUpdating, openPhotoPicker } = useChangeProfileImage();

  return (
    <View
      className='overflow-hidden rounded-2xl'
      style={getProfileCardShellStyle(highContrastMode, themeColors)}
    >
      <View className='items-center px-4 pb-1 pt-5' style={{ gap: spacing.md }}>
        <EditableUserAvatar
          imageUrl={imageUrl}
          initial={initial}
          isUpdating={isUpdating}
          palette={{
            avatarBg: themeColors.primary[700],
            avatarBorderColor: themeColors.border,
            avatarBorderWidth: highContrastMode ? 1 : 0,
            avatarTextColor: themeColors.text.inverse,
            gradientColors: [
              themeColors.primary[700],
              themeColors.primary[600],
            ],
          }}
          size={72}
          useGradient={!highContrastMode}
          onPress={openPhotoPicker}
        />
        <View className='items-center'>
          <Text
            style={{ ...typography.heading3, color: themeColors.text.primary }}
          >
            {name}
          </Text>
          {email ? (
            <Text
              className='mt-0.5'
              style={{
                ...typography.caption,
                color: themeColors.text.secondary,
              }}
            >
              {email}
            </Text>
          ) : null}
          {isPremium ? <ProfilePremiumBadge /> : null}
        </View>
      </View>
      <ProfileStatsRow
        highContrastMode={highContrastMode}
        isLoading={statsLoading}
        stats={stats}
      />
    </View>
  );
}
