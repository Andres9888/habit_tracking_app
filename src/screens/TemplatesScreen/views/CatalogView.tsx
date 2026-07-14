/**
 * CatalogView — unified browse page with search, category chips, and a
 * vertical category-grouped list (CatalogSectionList) for the "All" view.
 */

import { useDeferredValue, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';
import { SearchBar } from '../components/SearchBar';
import { useCatalogViewData } from '../hooks/useCatalogViewData';
import { CATALOG_ALL_ID, CatalogChipRail } from './CatalogChipRail';
import { CatalogFilteredBranch } from './CatalogFilteredBranch';
import { CatalogSectionList } from './CatalogSectionList';

interface CatalogViewProps {
  allTemplates: Doc<'templates'>[];
  catalogOrderImportedIds: Set<string>;
  importedTemplateIds: Set<string>;
  importingTemplateIds: Set<string>;
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
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const { chipCategories, filteredTemplates, groups } = useCatalogViewData({
    allTemplates: p.allTemplates,
    importedTemplateIds: p.catalogOrderImportedIds,
    searchQuery: deferredSearchQuery,
    selectedCategoryId,
  });
  const showShelves = selectedCategoryId === CATALOG_ALL_ID;
  const totalCount = p.allTemplates.length;
  const totalLabel = totalCount === 1 ? 'habit' : 'habits';

  return (
    <View
      testID='templates-catalog-view'
      style={[s.container, { backgroundColor: colors.background }]}
    >
      <ScreenHeader
        subtitle='Search or browse by category'
        title={`All habits · ${totalCount} ${totalLabel}`}
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
        <CatalogSectionList
          groups={groups}
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateIds={p.importingTemplateIds}
          onImport={p.onImport}
          onPreview={p.onPreview}
        />
      ) : (
        <CatalogFilteredBranch
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateIds={p.importingTemplateIds}
          selectedCategoryId={selectedCategoryId}
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
  searchWrap: { paddingHorizontal: spacing.base, paddingTop: spacing.xs },
});
