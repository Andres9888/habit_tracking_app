/**
 * CatalogChipRail — sticky horizontal category filter chips.
 */

import { useEffect, useRef } from 'react';
import { ScrollView, type LayoutChangeEvent } from 'react-native';
import { useBrowserPalette } from '../browserPalette';
import { CatalogFilterChip } from './CatalogFilterChip';
import { styles as s } from './CatalogChipRail.styles';

export const CATALOG_ALL_ID = 'all';

export interface CatalogChipItem {
  categoryId: string;
  /** Match count for the active search. Undefined while browsing idle. */
  count?: number;
  icon: string;
  label: string;
}

interface CatalogChipRailProps {
  categories: CatalogChipItem[];
  selectedCategoryId: string;
  /** Total matches across the catalog, shown on "All" during a search. */
  totalCount?: number;
  onSelectCategory: (categoryId: string) => void;
}

type ChipLayout = { width: number; x: number };

export function CatalogChipRail({
  categories,
  selectedCategoryId,
  totalCount,
  onSelectCategory,
}: CatalogChipRailProps) {
  const palette = useBrowserPalette();
  const scrollRef = useRef<ScrollView>(null);
  const chipLayouts = useRef<Record<string, ChipLayout>>({});
  const pendingScrollId = useRef<string | null>(null);

  const scrollToChip = (chipId: string) => {
    const layout = chipLayouts.current[chipId];
    if (!layout || !scrollRef.current) return false;
    scrollRef.current.scrollTo({
      animated: true,
      x: Math.max(0, layout.x - 12),
    });
    return true;
  };

  const handleChipLayout =
    (chipId: string) =>
    ({ nativeEvent }: LayoutChangeEvent) => {
      chipLayouts.current[chipId] = {
        x: nativeEvent.layout.x,
        width: nativeEvent.layout.width,
      };
      // A selected chip can lay out after the scroll effect ran (e.g. when an
      // off-screen category is opened from another screen). Honor the pending
      // scroll once its layout is finally measured.
      if (pendingScrollId.current === chipId && scrollToChip(chipId)) {
        pendingScrollId.current = null;
      }
    };

  useEffect(() => {
    // Scroll now if the chip is already measured; otherwise defer until its
    // onLayout fires.
    pendingScrollId.current = scrollToChip(selectedCategoryId)
      ? null
      : selectedCategoryId;
  }, [selectedCategoryId]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[s.rail, { borderBottomColor: palette.border }]}
      contentContainerStyle={s.content}
    >
      <CatalogFilterChip
        chipId={CATALOG_ALL_ID}
        count={totalCount}
        isSelected={selectedCategoryId === CATALOG_ALL_ID}
        label='All'
        onLayout={handleChipLayout}
        onSelect={onSelectCategory}
      />
      {categories.map((category) => (
        <CatalogFilterChip
          key={category.categoryId}
          chipId={category.categoryId}
          count={category.count}
          isSelected={selectedCategoryId === category.categoryId}
          label={`${category.icon} ${category.label}`}
          // Visual label carries the emoji; the spoken one must not, or
          // VoiceOver reads "flexed biceps Health, 4 matches".
          spokenLabel={category.label}
          onLayout={handleChipLayout}
          onSelect={onSelectCategory}
        />
      ))}
    </ScrollView>
  );
}
