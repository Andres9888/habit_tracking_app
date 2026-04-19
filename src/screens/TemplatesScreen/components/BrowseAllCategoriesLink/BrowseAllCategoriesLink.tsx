/**
 * BrowseAllCategoriesLink — Compact single-row link replacing the 2-column
 * CategoryGrid on the goal-first browse view. Categories remain discoverable
 * but don't compete with the goal hero.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, shadows, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

interface BrowseAllCategoriesLinkProps {
  categoryCount: number;
  previewIcons: string[];
  totalHabitCount: number;
  onPress: () => void;
}

export function BrowseAllCategoriesLink({
  categoryCount,
  previewIcons,
  totalHabitCount,
  onPress,
}: BrowseAllCategoriesLinkProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      testID='templates-browse-all-categories-link'
      accessibilityLabel={`Browse all ${categoryCount} categories with ${totalHabitCount} habits`}
      accessibilityRole='button'
      style={[
        s.link,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      <View style={s.left}>
        <View style={s.icons}>
          {previewIcons.slice(0, 4).map((icon, index) => (
            <Text key={index} style={s.icon}>
              {icon}
            </Text>
          ))}
        </View>
        <View>
          <Text style={[s.title, { color: colors.text.primary }]}>
            Browse all categories
          </Text>
          <Text style={[s.meta, { color: colors.text.tertiary }]}>
            {categoryCount} categories &middot; {totalHabitCount} habits
          </Text>
        </View>
      </View>
      <ChevronRight color={colors.text.tertiary} size={20} strokeWidth={2.5} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  icon: { fontSize: 16 },
  icons: { flexDirection: 'row', gap: 2 },
  left: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: spacing.sm + 2,
  },
  link: {
    ...shadows.subtle,
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  meta: { ...typography.caption, marginTop: 2 },
  title: {
    ...typography.bodySmall,
    fontWeight: fontWeights.semibold,
  },
});
