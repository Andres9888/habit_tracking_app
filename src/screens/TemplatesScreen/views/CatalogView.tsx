/**
 * CatalogView — unified browse page with search, category chips, and shelves.
 * Shelves reuse CategoryRow + TrendingCard (existing Netflix carousel).
 */

import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';
import { CategoryRow } from '../components/CategoryRowsSection/CategoryRow';
import type { CategoryGroup } from '../components/ExploreAllSection/ExploreAllSection.types';
import { SearchBar } from '../components/SearchBar';
import { useCatalogViewData } from '../hooks/useCatalogViewData';
import { CATALOG_ALL_ID, CatalogChipRail } from './CatalogChipRail';
import { CatalogFilteredList } from './CatalogFilteredList';

interface CatalogViewProps {
  allTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  initialCategoryId?: string;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function CatalogView(p: CatalogViewProps) {
  const { colors } = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    p.initialCategoryId ?? CATALOG_ALL_ID
  );
  const { chipCategories, filteredTemplates, groups } = useCatalogViewData({
    allTemplates: p.allTemplates,
    importedTemplateIds: p.importedTemplateIds,
    searchQuery,
    selectedCategoryId,
  });
  const showShelves = selectedCategoryId === CATALOG_ALL_ID;
  const importingId = p.importingTemplateId as Id<'templates'> | null;

  const renderShelf = ({ item }: { item: CategoryGroup }) => (
    <CategoryRow
      group={item}
      importedTemplateIds={p.importedTemplateIds}
      importingTemplateId={importingId}
      onImport={p.onImport}
      onPreview={p.onPreview}
      onSeeAll={() => setSelectedCategoryId(item.category)}
    />
  );

  return (
    <View
      testID='templates-catalog-view'
      style={[s.container, { backgroundColor: colors.background }]}
    >
      <ScreenHeader
        subtitle='Search or browse by category'
        title={`All habits · ${p.allTemplates.length}`}
        onBack={p.onBack}
      />
      <View style={s.searchWrap}>
        <SearchBar
          inputHint='Search habits…'
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </View>
      <CatalogChipRail
        categories={chipCategories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />
      {showShelves ? (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.category}
          contentContainerStyle={s.list}
          renderItem={renderShelf}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <CatalogFilteredList
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          templates={filteredTemplates}
          onImport={p.onImport}
          onPreview={p.onPreview}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingBottom: spacing['2xl'] },
  searchWrap: { paddingHorizontal: spacing.base, paddingTop: spacing.xs },
});
