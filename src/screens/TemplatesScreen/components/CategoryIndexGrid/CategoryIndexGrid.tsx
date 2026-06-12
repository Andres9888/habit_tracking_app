/**
 * CategoryIndexGrid — compact two-column index of top categories with
 * counts. Replaces the old text-only "Browse all categories" link on
 * the library main page; tapping a tile opens that category's habits.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { borderRadius, spacing } from '../../../../theme/spacing';
import { fontWeights, typography } from '../../../../theme/typography';

export interface CategoryIndexItem {
  categoryId: string;
  count: number;
  icon: string;
  label: string;
}

interface CategoryIndexGridProps {
  categories: CategoryIndexItem[];
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryIndexGrid({
  categories,
  onSelectCategory,
}: CategoryIndexGridProps) {
  const { colors } = useThemeColors();

  return (
    <View style={s.grid}>
      {categories.map((category) => {
        const countLabel = category.count === 1 ? 'habit' : 'habits';

        return (
          <Pressable
            key={category.categoryId}
            accessibilityLabel={`${category.label}, ${category.count} ${countLabel}`}
            accessibilityRole='button'
            style={[
              s.tile,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => onSelectCategory(category.categoryId)}
          >
            <Text style={s.icon}>{category.icon}</Text>
            <Text
              numberOfLines={1}
              style={[s.label, { color: colors.text.primary }]}
            >
              {category.label}
            </Text>
            <Text style={[s.count, { color: colors.text.tertiary }]}>
              {category.count}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  count: { ...typography.caption, marginLeft: 'auto' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  icon: { fontSize: 16 },
  label: {
    ...typography.bodySmall,
    flexShrink: 1,
    fontWeight: fontWeights.semibold,
  },
  tile: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexBasis: '47%',
    flexDirection: 'row',
    flexGrow: 1,
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
});
