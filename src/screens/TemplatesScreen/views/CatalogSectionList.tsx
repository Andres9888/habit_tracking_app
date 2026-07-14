/**
 * CatalogSectionList — vertical category-grouped list for the "All" catalog.
 * Replaces the Netflix shelf carousel: each category is a SectionHeader
 * followed by full-width HabitTemplateCard rows (matching the rest of the app).
 */

import { memo, useCallback, useMemo } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { spacing } from '../../../theme/spacing';
import { TemplateReadRow } from '../components/ExploreAllSection/TemplateReadRow';
import { SectionHeader } from '../components/SectionHeader';
import type { CategoryGroup } from '../components/ExploreAllSection/ExploreAllSection.types';
import { getCategoryMeta } from '../data/categoryMeta';

interface CatalogSectionListProps {
  groups: CategoryGroup[];
  importedTemplateIds: Set<string>;
  importingTemplateIds: Set<string>;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

interface CatalogSection {
  data: Doc<'templates'>[];
  key: string;
  label: string;
  subtitle?: string;
}

export const CatalogSectionList = memo(function CatalogSectionList(
  p: CatalogSectionListProps
) {
  const sections: CatalogSection[] = useMemo(
    () =>
      p.groups.map((group) => ({
        data: group.templates,
        key: group.category,
        label: `${group.icon} ${group.label}`,
        subtitle: getCategoryMeta(group.category).subtitle,
      })),
    [p.groups]
  );

  const renderItem = useCallback(
    ({ item }: { item: Doc<'templates'> }) => (
      <TemplateReadRow
        isImported={p.importedTemplateIds.has(item._id)}
        isImporting={p.importingTemplateIds.has(item._id)}
        item={item}
        onImport={p.onImport}
        onPreview={p.onPreview}
      />
    ),
    [p.importedTemplateIds, p.importingTemplateIds, p.onImport, p.onPreview]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: CatalogSection }) => (
      <View style={s.header}>
        <SectionHeader subtitle={section.subtitle} title={section.label} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Doc<'templates'>) => item._id, []);

  return (
    <SectionList
      contentContainerStyle={s.list}
      initialNumToRender={8}
      keyboardDismissMode='on-drag'
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={6}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      updateCellsBatchingPeriod={50}
      windowSize={7}
    />
  );
});

const s = StyleSheet.create({
  header: { marginTop: spacing.lg },
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
