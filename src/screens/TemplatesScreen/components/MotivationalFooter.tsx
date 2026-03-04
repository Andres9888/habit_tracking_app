/**
 * MotivationalFooter - Peak-End Rule (Kahneman, 1993)
 *
 * Creates a positive emotional close at the bottom of the
 * templates scroll to improve overall experience perception.
 */

import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

export function MotivationalFooter() {
  const { colors } = useThemeColors();

  return (
    <View style={s.container}>
      <Text style={[s.primary, { color: colors.text.secondary }]}>
        You're building something meaningful.
      </Text>
      <Text style={[s.secondary, { color: colors.text.tertiary }]}>
        Every habit you add is a vote for the person you want to become.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: 24,
  },
  primary: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  secondary: { fontSize: 11, marginTop: 4, textAlign: 'center' },
});
