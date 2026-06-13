/**
 * CatalogView — unified browse page with search, category chips, and shelves.
 * Shelves reuse CategoryRow + TrendingCard (existing Netflix carousel).
 */

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { useThemeColors } from '../../../theme/ThemeContext';
import { spacing } from '../../../theme/spacing';
import { SearchBar } from '../components/SearchBar';
import { useCatalogViewData } from '../hooks/useCatalogViewData';
import { CATALOG_ALL_ID, CatalogChipRail } from './CatalogChipRail';
import { CatalogFilteredBranch } from './CatalogFilteredBranch';
import { CatalogShelvesList } from './CatalogShelvesList';

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
        <CatalogShelvesList
          groups={groups}
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={importingId}
          onImport={p.onImport}
          onPreview={p.onPreview}
          onSeeAll={setSelectedCategoryId}
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
