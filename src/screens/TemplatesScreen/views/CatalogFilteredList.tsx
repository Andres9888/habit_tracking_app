/**
 * CatalogFilteredList — full vertical list when a category chip is selected.
 */

import { FlatList, StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { HabitTemplateCard } from '../components/HabitTemplateCard';

interface CatalogFilteredListProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function CatalogFilteredList(p: CatalogFilteredListProps) {
  return (
    <FlatList
      data={p.templates}
      keyExtractor={(item) => item._id}
      contentContainerStyle={s.list}
      renderItem={({ item }) => (
        <HabitTemplateCard
          descriptionLines={3}
          isImported={p.importedTemplateIds.has(item._id)}
          isImporting={p.importingTemplateId === item._id}
          item={item}
          onImport={p.onImport}
          onPreview={p.onPreview}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
