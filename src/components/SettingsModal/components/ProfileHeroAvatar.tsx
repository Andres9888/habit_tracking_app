/** ProfileHeroAvatar — the profile photo as a Habit Browser icon TILE
 *  (rounded square on a warm brand fill) rather than a gradient circle, so the
 *  profile card shares the library card's anatomy: tile first, then identity. */
import { View } from 'react-native';
import { airy } from '@/theme/airyScale';
import { UserAvatar } from '../UserAvatar';

interface ProfileHeroAvatarProps {
  imageUrl?: string | null;
  initial: string;
  themeColors: {
    card: string;
    primary: { 100: string; 600: string; 700: string; 400: string };
  };
}

/** Matches the Habit Browser card's 52px icon tile. */
const TILE_SIZE = 52;

export function ProfileHeroAvatar({
  imageUrl,
  initial,
  themeColors,
}: ProfileHeroAvatarProps) {
  return (
    <View
      className='items-center justify-center overflow-hidden'
      style={{
        backgroundColor: themeColors.primary[100],
        borderRadius: airy.tileRadius,
        height: TILE_SIZE,
        width: TILE_SIZE,
      }}
    >
      <UserAvatar
        imageUrl={imageUrl}
        initial={initial}
        palette={{
          avatarBg: 'transparent',
          avatarBorderColor: 'transparent',
          avatarBorderWidth: 0,
          avatarTextColor: themeColors.primary[700],
        }}
        size={TILE_SIZE}
      />
    </View>
  );
}
