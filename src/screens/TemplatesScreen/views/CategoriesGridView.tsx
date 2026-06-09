/**
 * CategoriesGridView — full category grid for browsing by area.
 */

import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';
import { CategoryGrid } from '../components/CategoryGrid';
import type { CategoryGroup } from '../components/ExploreAllSection/ExploreAllSection.types';
import { getCategoryMeta } from '../data/categoryMeta';

export interface CategoryGridItem {
  bgColor: string;
  categoryId: string;
  count: number;
  icon: string;
  label: string;
  previewEmojis: string[];
  textColor: string;
}

interface CategoriesGridViewProps {
  categories: CategoryGridItem[];
  onBack: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoriesGridView({
  categories,
  onBack,
  onSelectCategory,
}: CategoriesGridViewProps) {
  const { colors } = useThemeColors();

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        subtitle='Find habits by life area'
        title='Browse by category'
        onBack={onBack}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
      >
        <CategoryGrid
          categories={categories}
          onSelectCategory={onSelectCategory}
        />
      </ScrollView>
    </View>
  );
}

export function buildCategoryGridItems(groups: CategoryGroup[]) {
  return groups.map((group) => {
    const meta = getCategoryMeta(group.category);
    return {
      bgColor: meta.bgColor,
      categoryId: group.category,
      count: group.templates.length,
      icon: meta.icon,
      label: meta.label,
      previewEmojis: group.templates.slice(0, 4).map((t) => t.icon),
      textColor: meta.textColor,
    };
  });
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing['2xl'] },
});
