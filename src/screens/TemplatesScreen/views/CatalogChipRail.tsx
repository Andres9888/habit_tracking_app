/**
 * CatalogChipRail — sticky horizontal category filter chips.
 */

import { useEffect, useRef } from 'react';
import {
  ScrollView,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { CatalogFilterChip } from './CatalogFilterChip';
import { styles as s } from './CatalogChipRail.styles';

export const CATALOG_ALL_ID = 'all';

const EDGE_PAD = 12;

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
  const pendingScrollId = useRef<string | null>(null);
  const scrollXRef = useRef(0);
  const viewportWidthRef = useRef(0);
  const contentWidthRef = useRef(0);

  const ensureChipVisible = (chipId: string): boolean => {
    const layout = chipLayouts.current[chipId];
    const scroll = scrollRef.current;
    const viewport = viewportWidthRef.current;
    if (!layout || !scroll || viewport <= 0) return false;

    const contentW = contentWidthRef.current;
    const maxX = Math.max(0, contentW - viewport);
    const scrollX = scrollXRef.current;
    const chipLeft = layout.x;
    const chipRight = layout.x + layout.width;
    const visibleLeft = scrollX + EDGE_PAD;
    const visibleRight = scrollX + viewport - EDGE_PAD;

    let nextX = scrollX;
    if (chipLeft < visibleLeft) {
      nextX = chipLeft - EDGE_PAD;
    } else if (chipRight > visibleRight) {
      nextX = chipRight - viewport + EDGE_PAD;
    } else {
      return true;
    }

    nextX = Math.min(Math.max(0, nextX), maxX);
    if (Math.abs(nextX - scrollX) < 0.5) return true;

    scroll.scrollTo({ animated: true, x: nextX });
    scrollXRef.current = nextX;
    return true;
  };

  const handleChipLayout =
    (chipId: string) =>
    ({ nativeEvent }: LayoutChangeEvent) => {
      chipLayouts.current[chipId] = {
        x: nativeEvent.layout.x,
        width: nativeEvent.layout.width,
      };
      if (
        pendingScrollId.current === chipId &&
        ensureChipVisible(chipId)
      ) {
        pendingScrollId.current = null;
      }
    };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollXRef.current = e.nativeEvent.contentOffset.x;
  };

  const handleViewportLayout = (e: LayoutChangeEvent) => {
    viewportWidthRef.current = e.nativeEvent.layout.width;
    if (pendingScrollId.current) {
      if (ensureChipVisible(pendingScrollId.current)) {
        pendingScrollId.current = null;
      }
    }
  };

  const handleContentSizeChange = (w: number) => {
    contentWidthRef.current = w;
    if (pendingScrollId.current) {
      if (ensureChipVisible(pendingScrollId.current)) {
        pendingScrollId.current = null;
      }
    }
  };

  useEffect(() => {
    pendingScrollId.current = ensureChipVisible(selectedCategoryId)
      ? null
      : selectedCategoryId;
  }, [selectedCategoryId]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[s.rail, { borderBottomColor: colors.border }]}
      contentContainerStyle={s.content}
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onLayout={handleViewportLayout}
      onContentSizeChange={handleContentSizeChange}
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
