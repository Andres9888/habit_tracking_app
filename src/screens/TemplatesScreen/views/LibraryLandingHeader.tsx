/** Header block for LibraryLandingView — title, search, chips, list label. */

import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { SearchBar } from '../components/SearchBar';
import {
  CATALOG_ALL_ID,
  CatalogChipRail,
  type CatalogChipItem,
} from './CatalogChipRail';
import { s } from './LibraryLandingView.styles';

interface LibraryLandingHeaderProps {
  categoryList: CatalogChipItem[];
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  selectedCategoryId: string;
  totalHabitCount: number;
  visibleCount: number;
}

export function LibraryLandingHeader({
  categoryList,
  onSearchChange,
  onSearchClear,
  onSelectCategory,
  searchQuery,
  selectedCategoryId,
  totalHabitCount,
  visibleCount,
}: LibraryLandingHeaderProps) {
  const { colors } = useThemeColors();
  const selectedLabel = categoryList.find(
    (category) => category.categoryId === selectedCategoryId
  )?.label;
  const listLabel =
    selectedCategoryId === CATALOG_ALL_ID || !selectedLabel
      ? 'Most added'
      : `${selectedLabel} · by popularity`;

  return (
    <>
      <View style={s.header}>
        <Text style={[s.title, { color: colors.text.primary }]}>
          Habit Library
        </Text>
      </View>
      <View style={s.searchWrap}>
        <SearchBar
          inputHint={`Search ${totalHabitCount} science-backed habits`}
          value={searchQuery}
          onChangeText={onSearchChange}
          onClear={onSearchClear}
        />
      </View>
      <CatalogChipRail
        categories={categoryList}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={onSelectCategory}
      />
      <View style={s.listHeaderRow}>
        <Text style={[s.overline, { color: colors.text.tertiary }]}>
          {listLabel}
        </Text>
        <Text style={[s.count, { color: colors.text.tertiary }]}>
          {visibleCount} shown
        </Text>
      </View>
    </>
  );
}
