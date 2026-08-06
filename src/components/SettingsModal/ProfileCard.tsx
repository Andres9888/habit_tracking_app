/** ProfileCard — centered account hero: avatar + name + email (no metrics) */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '../../theme/typography';
import { EditableUserAvatar } from './EditableUserAvatar';
import { getProfileCardShellStyle } from './profileCardShellStyle';
import { ProfilePremiumBadge } from './ProfilePremiumBadge';
import { useChangeProfileImage } from './useChangeProfileImage';
import { useProfileDisplayImage } from './useProfileDisplayImage';
import { useProfileDisplayName } from './useProfileDisplayName';

interface ProfileCardProps {
  isPremium: boolean;
}

export function ProfileCard({ isPremium }: ProfileCardProps) {
  const { colors: themeColors } = useThemeColors();
  const { email, initial, name } = useProfileDisplayName();
  const { imageUrl } = useProfileDisplayImage();
  const { isUpdating, openPhotoPicker } = useChangeProfileImage();

  return (
    <View
      className='overflow-hidden rounded-2xl'
      style={getProfileCardShellStyle(themeColors)}
    >
      <View
        className='items-center px-4 pb-5 pt-6'
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
        <View className='items-center'>
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
        </View>
      </View>
    </View>
  );
}
