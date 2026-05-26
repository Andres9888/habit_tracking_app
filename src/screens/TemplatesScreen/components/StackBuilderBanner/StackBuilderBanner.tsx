/**
 * Encourages users building a habit stack during the current library session.
 */

import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

interface StackBuilderBannerProps {
  count: number;
}

export function StackBuilderBanner({ count }: StackBuilderBannerProps) {
  const { colors } = useThemeColors();
  const habitLabel = count === 1 ? 'habit' : 'habits';

  return (
    <View
      style={[
        s.wrap,
        {
          backgroundColor: colors.primary[100],
          borderColor: colors.primary[300],
        },
      ]}
    >
      <Text style={[s.eyebrow, { color: colors.primary[700] }]}>
        BUILDING YOUR STACK
      </Text>
      <Text style={[s.title, { color: colors.text.primary }]}>
        {count} {habitLabel} added — great momentum
      </Text>
      <Text style={[s.subtitle, { color: colors.text.secondary }]}>
        Pair habits that support the same transformation for best results.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  eyebrow: {
    ...typography.caption,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  subtitle: { ...typography.caption, lineHeight: 18, marginTop: 4 },
  title: { ...typography.bodySmall, fontWeight: fontWeights.bold },
  wrap: {
    borderRadius: borderRadius.large,
    borderWidth: 1,
    marginBottom: spacing.md,
    marginHorizontal: spacing.base,
    padding: spacing.base,
  },
});
