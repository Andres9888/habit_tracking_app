/**
 * CategoryGrid - 2-column grid of category tiles
 */

import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { CategoryTile } from './CategoryTile';

interface CategoryItem {
  bgColor: string;
  categoryId: string;
  count: number;
  icon: string;
  isPremium: boolean;
  label: string;
  textColor: string;
}

interface CategoryGridProps {
  categories: CategoryItem[];
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryGrid({ categories, onSelectCategory }: CategoryGridProps) {
  const rows: CategoryItem[][] = [];
  for (let i = 0; i < categories.length; i += 2) {
    rows.push(categories.slice(i, i + 2));
  }

  return (
    <View testID="templates-category-grid" style={s.container}>
      <Text style={s.title}>Browse by Category</Text>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={s.row}>
          {row.map((cat, colIdx) => (
            <CategoryTile
              key={cat.categoryId}
              bgColor={cat.bgColor}
              count={cat.count}
              icon={cat.icon}
              index={rowIdx * 2 + colIdx}
              isPremium={cat.isPremium}
              label={cat.label}
              textColor={cat.textColor}
              onPress={() => onSelectCategory(cat.categoryId)}
            />
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { gap: spacing.sm, marginTop: spacing.lg, paddingHorizontal: spacing.base },
  row: { flexDirection: 'row', gap: spacing.sm },
  title: { ...typography.heading3, color: colors.text.primary, marginBottom: spacing.xs },
});
