/**
 * SocialProofCard — testimonial card in the monetization flow.
 *
 * Displays a user quote and attribution from {@link SOCIAL_PROOF} to build
 * trust and encourage trial conversion.  Purely presentational; no props.
 */

import { Text, View, StyleSheet } from 'react-native';
import { SOCIAL_PROOF } from './constants';
import { useThemeColors } from '@/theme/ThemeContext';

export function SocialProofCard() {
  const { colors } = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${colors.gray[100]}CC`,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.text.primary }]}>
        Proven momentum
      </Text>
      <Text style={[styles.quote, { color: colors.text.primary }]}>
        "{SOCIAL_PROOF.quote}"
      </Text>
      <Text style={[styles.attribution, { color: colors.text.secondary }]}>
        {SOCIAL_PROOF.attribution}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  attribution: {
    fontSize: 13,
    fontWeight: '400',
  },
  container: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  quote: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
});
