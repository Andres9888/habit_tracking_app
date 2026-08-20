/** AboutFooter — Privacy · Terms · What's new · version. */
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';

interface Props {
  version: string;
  buildNumber: string;
  onPrivacy: () => void;
  onTerms: () => void;
  onWhatsNew: () => void;
}

export function AboutFooter({
  version,
  buildNumber,
  onPrivacy,
  onTerms,
  onWhatsNew,
}: Props) {
  const { colors: themeColors } = useThemeColors();
  const footerStyle = {
    ...typography.caption,
    fontSize: 12,
    color: themeColors.text.tertiary,
  };
  const links = [
    { key: 'privacy', label: 'Privacy', onPress: onPrivacy },
    { key: 'terms', label: 'Terms', onPress: onTerms },
    { key: 'whatsNew', label: "What's new", onPress: onWhatsNew },
  ];

  return (
    <View className='flex-row flex-wrap items-center justify-center pt-1'>
      {links.map((link) => (
        <View key={link.key} className='flex-row items-center'>
          {/* Pressable (not Text onPress) so the 12px caption gets a real
              touch target — Text doesn't accept hitSlop. */}
          <Pressable
            accessibilityLabel={link.label}
            accessibilityRole='link'
            hitSlop={12}
            onPress={link.onPress}
          >
            <Text style={footerStyle}>{link.label}</Text>
          </Pressable>
          <Text style={footerStyle}> · </Text>
        </View>
      ))}
      <Text style={footerStyle}>
        v{version} ({buildNumber})
      </Text>
    </View>
  );
}
