/** SettingsHeader - Editorial settings header: "Chain Day" kicker + serif title + close */
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { fontFamilies, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';

interface SettingsHeaderProps {
  onClose: () => void;
}

export function SettingsHeader({ onClose }: SettingsHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useThemeColors();

  return (
    <View
      accessibilityRole='header'
      style={{
        backgroundColor: themeColors.background,
        paddingTop: Math.max(insets.top + 8, 16),
        paddingHorizontal: 20,
        paddingBottom: 12,
      }}
    >
      <View className='flex-row items-end justify-between'>
        <View style={{ gap: 3 }}>
          <Text
            style={{
              fontFamily: fontFamilies.primary.text,
              fontSize: 10.5,
              fontWeight: fontWeights.bold,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: themeColors.primary[700],
            }}
          >
            Chain Day
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.serif,
              fontSize: 29,
              fontWeight: fontWeights.semibold,
              letterSpacing: -0.5,
              lineHeight: 32,
              color: themeColors.text.primary,
            }}
          >
            Settings
          </Text>
        </View>
        <ModalCloseButton
          label='Close settings'
          testID='close-settings-modal'
          onClose={onClose}
        />
      </View>
    </View>
  );
}
