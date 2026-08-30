/** SettingsHeader - Editorial settings header: "Chain Day" kicker + serif title + close */
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { airy } from '@/theme/airyScale';
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
        paddingHorizontal: airy.screenPadH,
        paddingBottom: 12,
      }}
    >
      {/* Spec 4a: eyebrow 11/700 ls 2.5 above a 33/700 serif title, 6px gap. */}
      <View className='flex-row items-start justify-between'>
        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontFamily: fontFamilies.primary.text,
              fontSize: 12,
              fontWeight: fontWeights.bold,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              color: themeColors.primary[700],
            }}
          >
            Chain Day
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.serif,
              fontSize: 33,
              fontWeight: fontWeights.bold,
              letterSpacing: -0.5,
              lineHeight: 38,
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
