/**
 * LibraryLandingView — "Two Worlds" library landing: header, category
 * chips, search, and one flat popularity-sorted list with inline
 * "why this works" reads and post-add pairing nudges.
 */

import { useMemo } from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { buildCategoryList } from '../hooks/buildCategoryList';
import { LibraryEndcap } from '../components/LibraryEndcap';
import { LibraryLandingHeader } from './LibraryLandingHeader';
import { LibraryLandingRow } from './LibraryLandingRow';
import { spacing } from '../../../theme/spacing';
import { useLibraryLandingView } from './LibraryLandingView.hooks';
import { s } from './LibraryLandingView.styles';

interface LibraryLandingViewProps {
  allTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSeeAll: () => void;
  searchQuery: string;
  totalHabitCount: number;
}

export function LibraryLandingView({
  allTemplates,
  importedTemplateIds,
  importingTemplateId,
  onImport,
  onPreview,
  onSearchChange,
  onSearchClear,
  onSeeAll,
  searchQuery,
  totalHabitCount,
}: LibraryLandingViewProps) {
  const insets = useSafeAreaInsets();
  const categoryList = useMemo(
    () => buildCategoryList(allTemplates),
    [allTemplates]
  );
  const {
    handleImport,
    justAddedIds,
    onSelectCategory,
    selectedCategoryId,
    topTemplateByCategory,
    visibleTemplates,
  } = useLibraryLandingView({ allTemplates, onImport, searchQuery });

  return (
    <FlatList
      contentContainerStyle={[s.list, { paddingTop: insets.top + spacing.xs }]}
      data={visibleTemplates}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={
        <LibraryLandingHeader
          categoryList={categoryList}
          searchQuery={searchQuery}
          selectedCategoryId={selectedCategoryId}
          totalHabitCount={totalHabitCount}
          visibleCount={visibleTemplates.length}
          onSearchChange={onSearchChange}
          onSearchClear={onSearchClear}
          onSelectCategory={onSelectCategory}
        />
      }
      ListFooterComponent={
        <LibraryEndcap totalHabitCount={totalHabitCount} onPress={onSeeAll} />
      }
      renderItem={({ item }) => (
        <LibraryLandingRow
          importedTemplateIds={importedTemplateIds}
          importingTemplateId={importingTemplateId}
          item={item}
          justAdded={justAddedIds.has(item._id)}
          topTemplateByCategory={topTemplateByCategory}
          onImport={handleImport}
          onPreview={onPreview}
        />
      )}
    />
  );
}
