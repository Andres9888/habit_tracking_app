/**
 * Link to open the full category grid instead of stacked carousels.
 */

import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

interface BrowseCategoriesLinkProps {
  categoryCount: number;
  onPress: () => void;
}

export function BrowseCategoriesLink({
  categoryCount,
  onPress,
}: BrowseCategoriesLinkProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      accessibilityLabel={`Browse all ${categoryCount} categories`}
      accessibilityRole='button'
      style={[
        s.button,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      <Text style={[s.label, { color: colors.text.primary }]}>
        Browse all categories
      </Text>
      <Text style={[s.arrow, { color: colors.primary[600] }]}>→</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  arrow: { ...typography.body, fontWeight: fontWeights.bold },
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  label: { ...typography.bodySmall, fontWeight: fontWeights.bold },
});
