/** UserAvatar — profile photo with initial fallback */
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius } from '../../theme/spacing';
import { fontWeights } from '../../theme/typography';

export interface UserAvatarPalette {
  avatarBg: string;
  avatarBorderColor: string;
  avatarBorderWidth: number;
  avatarTextColor: string;
  gradientColors?: readonly [string, string];
}

interface UserAvatarProps {
  imageUrl?: string | null;
  initial: string;
  size: number;
  palette: UserAvatarPalette;
  useGradient?: boolean;
}

export function UserAvatar({
  imageUrl,
  initial,
  size,
  palette,
  useGradient = false,
}: UserAvatarProps) {
  const shellStyle = {
    borderColor: palette.avatarBorderColor,
    borderRadius: borderRadius.full,
    borderWidth: palette.avatarBorderWidth,
    height: size,
    overflow: 'hidden' as const,
    width: size,
  };

  const content = imageUrl ? (
    <Image
      accessibilityLabel='Profile photo'
      contentFit='cover'
      source={{ uri: imageUrl }}
      style={{ height: size, width: size }}
    />
  ) : (
    <Text
      style={{
        color: palette.avatarTextColor,
        fontSize: Math.round(size * 0.42),
        fontWeight: fontWeights.bold,
      }}
    >
      {initial}
    </Text>
  );

  if (useGradient && palette.gradientColors && !imageUrl) {
    return (
      <LinearGradient
        colors={palette.gradientColors}
        style={{
          ...shellStyle,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View
      className='items-center justify-center'
      style={{ ...shellStyle, backgroundColor: palette.avatarBg }}
    >
      {content}
    </View>
  );
}
