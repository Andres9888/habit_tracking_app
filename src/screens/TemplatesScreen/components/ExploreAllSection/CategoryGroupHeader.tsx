/**
 * Sticky category header inside the Explore All list
 */

import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

interface CategoryGroupHeaderProps {
  count: number;
  icon: string;
  label: string;
  subtitle?: string;
}

export function CategoryGroupHeader({
  count,
  icon,
  label,
  subtitle,
}: CategoryGroupHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={s.topLine}>
        <Text style={s.icon}>{icon}</Text>
        <Text style={[s.label, { color: colors.text.primary }]}>{label}</Text>
        <Text style={[s.count, { color: colors.text.tertiary }]}>· {count}</Text>
      </View>
      {subtitle ? (
        <Text style={[s.subtitle, { color: colors.text.secondary }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  count: { ...typography.caption },
  icon: { fontSize: 17 },
  label: { ...typography.body, fontWeight: fontWeights.bold },
  subtitle: { ...typography.caption, marginTop: 2, paddingLeft: 26 },
  topLine: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
});
