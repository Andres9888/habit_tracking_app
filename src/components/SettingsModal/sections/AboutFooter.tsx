/** AboutFooter — quiet centred "Privacy · Terms · v1.2.3 (45)" line.
 *  What's New moved up into Support (it's a tappable action, not a legal link).
 *  Build number stays for support triage even though the mock shows version only. */
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';

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
  const footerStyle = {
    ...typography.caption,
    fontSize: 12,
    color: themeColors.text.tertiary,
  };
  const links = [
    { key: 'privacy', label: 'Privacy', onPress: onPrivacy },
    { key: 'terms', label: 'Terms', onPress: onTerms },
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
