/** AboutFooter — quiet Privacy/Terms links + version caption (replaces the About card rows) */
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../theme/typography';

interface Props {
  version: string;
  buildNumber: string;
  onPrivacy: () => void;
  onTerms: () => void;
}

export function AboutFooter({
  version,
  buildNumber,
  onPrivacy,
  onTerms,
}: Props) {
  const { colors: themeColors } = useThemeColors();
  const linkStyle = {
    ...typography.bodySmall,
    fontWeight: fontWeights.medium,
    color: themeColors.primary[700],
  };

  return (
    <View className='items-center pt-1' style={{ gap: 12 }}>
      <View className='flex-row items-center' style={{ gap: 24 }}>
        <Text accessibilityRole='link' style={linkStyle} onPress={onPrivacy}>
          Privacy Policy
        </Text>
        <View
          style={{
            backgroundColor: themeColors.border,
            borderRadius: 2,
            height: 3,
            width: 3,
          }}
        />
        <Text accessibilityRole='link' style={linkStyle} onPress={onTerms}>
          Terms of Service
        </Text>
      </View>
      <Text style={{ ...typography.caption, color: themeColors.text.tertiary }}>
        Chain Day · Version {version} ({buildNumber})
      </Text>
    </View>
  );
}
