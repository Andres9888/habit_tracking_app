/**
 * CatalogView — unified browse page with search, category chips, and a
 * vertical category-grouped list (CatalogSectionList) for the "All" view.
 */

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { spacing } from '../../../theme/spacing';
import { useBrowserPalette } from '../browserPalette';
import { SearchBar } from '../components/SearchBar';
import { useCatalogViewData } from '../hooks/useCatalogViewData';
import { CatalogHeader } from './CatalogHeader';
import { CATALOG_ALL_ID, CatalogChipRail } from './CatalogChipRail';
import { CatalogFilteredBranch } from './CatalogFilteredBranch';
import { CatalogSectionList } from './CatalogSectionList';

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
  const palette = useBrowserPalette();
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

  return (
    <View
      testID='templates-catalog-view'
      style={[s.container, { backgroundColor: palette.background }]}
    >
      <CatalogHeader onClose={p.onBack} />
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
          importingTemplateId={p.importingTemplateId}
          onImport={p.onImport}
          onPreview={p.onPreview}
        />
      ) : (
        <CatalogFilteredBranch
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
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
