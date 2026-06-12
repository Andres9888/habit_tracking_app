/**
 * CatalogChipRail — sticky horizontal category filter chips.
 */

import { useEffect, useRef } from 'react';
import { ScrollView, type LayoutChangeEvent } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { CatalogFilterChip } from './CatalogFilterChip';
import { styles as s } from './CatalogChipRail.styles';

export const CATALOG_ALL_ID = 'all';

export interface CatalogChipItem {
  categoryId: string;
  icon: string;
  label: string;
}

interface CatalogChipRailProps {
  categories: CatalogChipItem[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

type ChipLayout = { width: number; x: number };

export function CatalogChipRail({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CatalogChipRailProps) {
  const { colors } = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);
  const chipLayouts = useRef<Record<string, ChipLayout>>({});

  const handleChipLayout =
    (chipId: string) =>
    ({ nativeEvent }: LayoutChangeEvent) => {
      chipLayouts.current[chipId] = {
        x: nativeEvent.layout.x,
        width: nativeEvent.layout.width,
      };
    };

  useEffect(() => {
    const layout = chipLayouts.current[selectedCategoryId];
    if (!layout || !scrollRef.current) return;
    scrollRef.current.scrollTo({
      animated: true,
      x: Math.max(0, layout.x - 12),
    });
  }, [selectedCategoryId]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[s.rail, { borderBottomColor: colors.border }]}
      contentContainerStyle={s.content}
    >
      <CatalogFilterChip
        chipId={CATALOG_ALL_ID}
        isSelected={selectedCategoryId === CATALOG_ALL_ID}
        label='All'
        onLayout={handleChipLayout}
        onSelect={onSelectCategory}
      />
      {categories.map((category) => (
        <CatalogFilterChip
          key={category.categoryId}
          chipId={category.categoryId}
          isSelected={selectedCategoryId === category.categoryId}
          label={`${category.icon} ${category.label}`}
          onLayout={handleChipLayout}
          onSelect={onSelectCategory}
        />
      ))}
    </ScrollView>
  );
}
