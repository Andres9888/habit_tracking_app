import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontWeights, typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export function DrillSectionLabel({ label }: { label: string }) {
  const { colors } = useThemeColors();
  return (
    <View style={s.row}>
      <Text style={[s.text, { color: colors.text.tertiary }]}>{label}</Text>
      <View style={[s.line, { backgroundColor: colors.border }]} />
    </View>
  );
}

const s = StyleSheet.create({
  line: { flex: 1, height: 1 },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
  },
  text: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
});
