/** Gradient hairline ring wrapping the profile avatar */
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { borderRadius } from '@/theme/spacing';
import { UserAvatar } from '../UserAvatar';

interface ProfileHeroAvatarProps {
  imageUrl?: string | null;
  initial: string;
  themeColors: {
    card: string;
    primary: { 100: string; 600: string; 700: string; 400: string };
  };
}

export function ProfileHeroAvatar({
  imageUrl,
  initial,
  themeColors,
}: ProfileHeroAvatarProps) {
  // Spec 4a: 50px gradient circle in the profile row.
  const avatarSize = 58;
  const ringPadding = 2;

  return (
    <LinearGradient
      colors={[themeColors.primary[400], themeColors.primary[700]]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{ borderRadius: borderRadius.full, padding: ringPadding }}
    >
      <View
        style={{
          backgroundColor: themeColors.card,
          borderRadius: borderRadius.full,
          padding: 1,
        }}
      >
        <UserAvatar
          imageUrl={imageUrl}
          initial={initial}
          palette={{
            avatarBg: themeColors.primary[100],
            avatarBorderColor: 'transparent',
            avatarBorderWidth: 0,
            avatarTextColor: themeColors.primary[700],
            gradientColors: [
              themeColors.primary[700],
              themeColors.primary[600],
            ],
          }}
          size={avatarSize - ringPadding * 4}
          useGradient
        />
      </View>
    </LinearGradient>
  );
}
