/** AppVersionFooter — Privacy · Terms · What's new · version.
 *
 *  The single place the app prints its version. The Account page used to print
 *  it a second time in a different format ("Chain Day · Version 1.0.0 (1)"),
 *  so the same fact had two spellings two taps apart. */
import Constants from 'expo-constants';
import { Fragment } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';

interface Props {
  onPrivacy: () => void;
  onTerms: () => void;
  onWhatsNew: () => void;
}

export function AppVersionFooter({ onPrivacy, onTerms, onWhatsNew }: Props) {
  const { colors: themeColors } = useThemeColors();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber ?? '1';
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
        // Separator rendered BEFORE each item rather than trailing it, so the
        // list stays correct if the version string is ever dropped.
        <Fragment key={link.key}>
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
        </Fragment>
      ))}
      <Text style={footerStyle}>
        v{version} ({buildNumber})
      </Text>
    </View>
  );
}
