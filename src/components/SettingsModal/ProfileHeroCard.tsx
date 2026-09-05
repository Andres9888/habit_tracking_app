/** ProfileHeroCard — spec 4a profile row: avatar, name, edit hint, chevron.
 *  Streak headline, stat tiles, and the weekly ring were intentionally removed
 *  from Settings (handoff README: they belong on a dedicated Stats screen). */
import { View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { airy } from '@/theme/airyScale';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
import { getProfileCardShellStyle } from './profileCardShellStyle';
import { ProfileHeroAvatar } from './components/ProfileHeroAvatar';
import { ProfileHeroIdentity } from './components/ProfileHeroIdentity';
import { useProfileDisplayImage } from './useProfileDisplayImage';
import { useProfileDisplayName } from './useProfileDisplayName';

interface ProfileHeroCardProps {
  isPremium: boolean;
  onPress: () => void;
}

export function ProfileHeroCard({ isPremium, onPress }: ProfileHeroCardProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const { initial, name } = useProfileDisplayName();
  const { imageUrl } = useProfileDisplayImage();

  return (
    <AnimatedPressable
      accessibilityHint='Opens your profile and account settings'
      accessibilityLabel='Account settings'
      accessibilityRole='button'
      animationConfig={{ enableHaptics: true, hapticStyle: 'light' }}
      onPress={onPress}
    >
      <View
        className='overflow-hidden rounded-2xl'
        style={[
          getProfileCardShellStyle(themeColors, isDark),
          { borderRadius: airy.cardRadius },
        ]}
      >
        <View
          className='flex-row items-center px-4'
          style={{ gap: 14, paddingVertical: 14 }}
        >
          <ProfileHeroAvatar
            imageUrl={imageUrl}
            initial={initial}
            themeColors={themeColors}
          />
          <ProfileHeroIdentity isPremium={isPremium} name={name} />
          <ChevronRight
            color={themeColors.text.tertiary}
            size={iconSizes.small}
          />
        </View>
      </View>
    </AnimatedPressable>
  );
}
