/** HighContrastAccountRow — solid, bordered account card for high-contrast mode */
import { View } from 'react-native';
import { highContrastColors } from '@/theme/highContrastColors';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColors } from '../../theme/ThemeContext';
import { componentSpacing } from '../../theme/spacing';
import { AccountRowContent, type AccountRowPalette } from './AccountRowContent';

interface Props {
  name: string;
  email?: string;
  imageUrl?: string | null;
  initial: string;
  isPremium: boolean;
  onPress: () => void;
}

export function HighContrastAccountRow({
  name,
  email,
  imageUrl,
  initial,
  isPremium,
  onPress,
}: Props) {
  const { colors: c, isDark } = useThemeColors();

  const palette: AccountRowPalette = {
    avatarBg: c.text.primary,
    avatarBorderColor: 'transparent',
    avatarBorderWidth: 0,
    avatarTextColor: c.text.inverse,
    textColor: c.text.primary,
    subColor: c.text.secondary,
    chevronColor: c.text.tertiary,
    badgeBg: c.status.warningLight,
    badgeFg: c.status.warningText,
  };

  return (
    <AnimatedPressable
      accessibilityLabel='Account settings'
      accessibilityRole='button'
      onPress={onPress}
    >
      <View
        className='overflow-hidden rounded-2xl'
        style={{
          backgroundColor: isDark ? highContrastColors.background : '#000000',
          borderColor: c.border,
          borderWidth: 1,
        }}
      >
        <AccountRowContent
          avatarSize={componentSpacing.avatar.size}
          email={email}
          imageUrl={imageUrl}
          initial={initial}
          isPremium={isPremium}
          name={name}
          nameSize={16}
          palette={palette}
        />
      </View>
    </AnimatedPressable>
  );
}
