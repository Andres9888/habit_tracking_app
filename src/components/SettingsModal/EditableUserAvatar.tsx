/** EditableUserAvatar — tappable profile photo with change affordance */
import { ActivityIndicator, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { UserAvatar, type UserAvatarPalette } from './UserAvatar';

interface EditableUserAvatarProps {
  imageUrl?: string | null;
  initial: string;
  size: number;
  palette: UserAvatarPalette;
  useGradient?: boolean;
  isUpdating?: boolean;
  onPress: () => void;
}

export function EditableUserAvatar({
  imageUrl,
  initial,
  size,
  palette,
  useGradient,
  isUpdating = false,
  onPress,
}: EditableUserAvatarProps) {
  const badgeSize = Math.max(26, Math.round(size * 0.36));

  return (
    <AnimatedPressable
      accessibilityHint='Opens options to take or choose a new photo'
      accessibilityLabel='Change profile photo'
      accessibilityRole='button'
      disabled={isUpdating}
      onPress={onPress}
    >
      <View>
        <UserAvatar
          imageUrl={imageUrl}
          initial={initial}
          palette={palette}
          size={size}
          useGradient={useGradient}
        />
        <View
          className='absolute items-center justify-center'
          style={{
            backgroundColor: palette.avatarBg,
            borderColor: palette.avatarBorderColor,
            borderRadius: badgeSize / 2,
            borderWidth: palette.avatarBorderWidth,
            bottom: 0,
            height: badgeSize,
            right: 0,
            width: badgeSize,
          }}
        >
          {isUpdating ? (
            <ActivityIndicator color={palette.avatarTextColor} size='small' />
          ) : (
            <Camera color={palette.avatarTextColor} size={iconSizes.small} />
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}
