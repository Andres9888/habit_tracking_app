/**
 * CatalogShelvesList — Netflix-style category shelf carousel.
 */

import { FlatList, StyleSheet } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { spacing } from '../../../theme/spacing';
import { CategoryRow } from '../components/CategoryRowsSection/CategoryRow';
import type { CategoryGroup } from '../components/ExploreAllSection/ExploreAllSection.types';

interface CatalogShelvesListProps {
  groups: CategoryGroup[];
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: (categoryId: string) => void;
}

export function CatalogShelvesList(p: CatalogShelvesListProps) {
  return (
    <FlatList
      data={p.groups}
      keyboardDismissMode='on-drag'
      keyExtractor={(item) => item.category}
      contentContainerStyle={s.list}
      renderItem={({ item }) => (
        <CategoryRow
          group={item}
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          onImport={p.onImport}
          onPreview={p.onPreview}
          onSeeAll={() => p.onSeeAll(item.category)}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
