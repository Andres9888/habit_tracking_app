/**
 * CategoryGrid - 2-column grid of category tiles
 */

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';
import { CategoryTile } from './CategoryTile';

const INITIAL_VISIBLE = 6;

interface CategoryItem {
  bgColor: string;
  categoryId: string;
  count: number;
  icon: string;
  label: string;
  previewEmojis: string[];
  textColor: string;
}

interface CategoryGridProps {
  categories: CategoryItem[];
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryGrid({
  categories,
  onSelectCategory,
}: CategoryGridProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? categories : categories.slice(0, INITIAL_VISIBLE);

  const rows: CategoryItem[][] = [];
  for (let i = 0; i < visible.length; i += 2) {
    rows.push(visible.slice(i, i + 2));
  }

  return (
    <View testID='templates-category-grid' style={s.container}>
      <Text style={s.title}>🗂️ Browse by Category</Text>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={s.row}>
          {row.map((cat, colIdx) => (
            <CategoryTile
              key={cat.categoryId}
              bgColor={cat.bgColor}
              count={cat.count}
              icon={cat.icon}
              index={rowIdx * 2 + colIdx}
              label={cat.label}
              previewEmojis={cat.previewEmojis}
              textColor={cat.textColor}
              onPress={() => onSelectCategory(cat.categoryId)}
            />
          ))}
          {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
      {categories.length > INITIAL_VISIBLE && !showAll && (
        <Pressable
          accessibilityLabel={`Show all ${categories.length} categories`}
          accessibilityRole='button'
          style={s.showAllButton}
          onPress={() => setShowAll(true)}
        >
          <Text style={s.showAllText}>
            Show all {categories.length} categories
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  showAllButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing.xs,
    paddingVertical: spacing.md,
  },
  showAllText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
  title: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
});
