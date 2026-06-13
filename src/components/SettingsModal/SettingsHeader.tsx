/** SettingsHeader - Editorial settings header: "Chain Day" kicker + serif title + close */
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import type { SettingsColors } from './types';

interface SettingsHeaderProps {
  colors: SettingsColors;
  onClose: () => void;
}

export function SettingsHeader({ colors, onClose }: SettingsHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      accessibilityRole='header'
      style={{
        backgroundColor: colors.background,
        paddingTop: Math.max(insets.top + 8, 16),
        paddingHorizontal: 20,
        paddingBottom: 12,
      }}
    >
      <View className='flex-row items-end justify-between'>
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontFamily: fontFamilies.primary.text,
              fontSize: 10.5,
              fontWeight: fontWeights.semibold,
              letterSpacing: 2.4,
              textTransform: 'uppercase',
              color: themeColors.text.tertiary,
            }}
          >
            Chain Day
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.serif,
              fontSize: 30,
              fontWeight: fontWeights.semibold,
              letterSpacing: -0.4,
              color: themeColors.text.primary,
            }}
          >
            Settings
          </Text>
        </View>
        <ModalCloseButton label='Close settings' onClose={onClose} />
      </View>
    </View>
  );
}
