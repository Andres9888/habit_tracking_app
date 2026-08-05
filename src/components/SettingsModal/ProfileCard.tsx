/** ProfileCard — left-aligned account hero: identity + tenure + edit */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { typography } from '../../theme/typography';
import { SkeletonLoader } from '../SkeletonLoader/SkeletonLoader';
import { EditableUserAvatar } from './EditableUserAvatar';
import { formatMemberSince } from './memberSince';
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
  const { convexUser, imageUrl } = useProfileDisplayImage();
  const { isUpdating, openPhotoPicker } = useChangeProfileImage();
  const memberSince = formatMemberSince(convexUser);

  return (
    <View
      className='overflow-hidden rounded-2xl'
      style={getProfileCardShellStyle(themeColors)}
    >
      <View
        className='flex-row items-center px-4 pb-4 pt-4'
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
          {/* Same type token as the email line above, differing only in
              colour: `caption` carries letterSpacing 0.12 and weight 500,
              which made this line sit visibly off the shared left edge. */}
          <View className='mt-1'>
            {convexUser === undefined ? (
              <SkeletonLoader borderRadius={6} height={16} width={148} />
            ) : memberSince ? (
              <Text
                numberOfLines={1}
                style={{
                  ...typography.bodySmall,
                  color: themeColors.text.tertiary,
                }}
              >
                {memberSince}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
