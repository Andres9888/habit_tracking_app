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
              touch target — Text doesn't accept hitSlop. 16 keeps the tappable
              box past 44px; 12 left it around 36. */}
          <Pressable
            accessibilityLabel={link.label}
            accessibilityRole='link'
            hitSlop={16}
            onPress={link.onPress}
          >
            <Text style={footerStyle}>{link.label}</Text>
          </Pressable>
          <Text style={footerStyle}> · </Text>
        </View>
      ))}
      {/* selectable so support can be sent the exact build via long-press copy —
          the build number is only here for triage, and unselectable text made
          users retype it. */}
      <Text selectable style={footerStyle}>
        v{version} ({buildNumber})
      </Text>
    </View>
  );
}
