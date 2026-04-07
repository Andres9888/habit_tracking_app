/**
 * Divider line with "Explore all habits" label
 */

import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';

export function ExploreDivider() {
  const { colors } = useThemeColors();
  const line = { backgroundColor: colors.border };

  return (
    <View style={s.container}>
      <View style={[s.line, line]} />
      <Text style={[s.label, { color: colors.text.tertiary }]}>
        Explore all habits
      </Text>
      <View style={[s.line, line]} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
  },
  label: {
    fontSize: 11,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  line: { flex: 1, height: 1 },
});
