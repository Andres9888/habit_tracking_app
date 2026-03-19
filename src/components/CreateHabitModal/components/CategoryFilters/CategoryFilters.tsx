/**
 * CategoryFilters Component
 * Horizontal scrollable category filter chips
 */

import { ScrollView } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { CATEGORY_COLORS, DEFAULT_COLORS } from './CategoryFilters.constants';
import { CategoryFilterItem } from './CategoryFilterItem';
import type { CategoryFiltersProps } from './CategoryFilters.types';

export function CategoryFilters({
  categories,
  onSelect,
  selectedCategory,
}: CategoryFiltersProps) {
  const { colors } = useThemeColors();

  return (
    <ScrollView
      horizontal
      accessibilityLabel='Category filters'
      accessibilityRole='list'
      className='border-b'
      style={{ borderColor: colors.border }}
      contentContainerClassName='gap-3 px-4 py-4'
      showsHorizontalScrollIndicator={false}
    >
      {categories.map((category, index) => {
        const selected = selectedCategory === category.id;
        const colors = CATEGORY_COLORS[category.id] || DEFAULT_COLORS;

        return (
          <CategoryFilterItem
            key={category.id}
            category={category}
            colors={colors}
            index={index}
            selected={selected}
            onSelect={onSelect}
          />
        );
      })}
    </ScrollView>
  );
}
