/**
 * Session progress pill — shows how many habits were added this session.
 */

import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

interface SessionProgressPillProps {
  count: number;
}

export function SessionProgressPill({ count }: SessionProgressPillProps) {
  const { colors } = useThemeColors();
  if (count < 1) return null;

  const label = count === 1 ? '1 added today ✓' : `${count} added today ✓`;

  return (
    <View
      accessibilityLabel={label}
      style={[
        s.pill,
        {
          backgroundColor: colors.primary[50],
          borderColor: colors.primary[200],
        },
      ]}
    >
      <Text style={[s.text, { color: colors.primary[700] }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  pill: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  text: {
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
});
