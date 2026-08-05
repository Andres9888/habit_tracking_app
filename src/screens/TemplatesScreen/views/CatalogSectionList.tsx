/**
 * CatalogSectionList — vertical category-grouped list for the "All" catalog.
 * Replaces the Netflix shelf carousel: each category is a SectionHeader
 * followed by full-width HabitTemplateCard rows (matching the rest of the app).
 */

import { useCallback, useMemo, type ReactElement } from 'react';
import type { SectionListRenderItem } from 'react-native';
import { SectionList, StyleSheet, View } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { spacing } from '../../../theme/spacing';
import { TemplateReadRow } from '../components/ExploreAllSection/TemplateReadRow';
import { TEMPLATE_READ_ROW_PADDING } from '../components/ExploreAllSection/TemplateReadRow.styles';
import { SectionHeader } from '../components/SectionHeader';
import type { CategoryGroup } from '../components/ExploreAllSection/ExploreAllSection.types';

interface CatalogSectionListProps {
  groups: CategoryGroup[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  /** Rendered when a search clears every section. */
  listEmptyComponent?: ReactElement;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

interface CatalogSection {
  data: Doc<'templates'>[];
  icon: string;
  key: string;
  label: string;
  subtitle?: string;
}

export function CatalogSectionList(p: CatalogSectionListProps) {
  const {
    groups,
    importedTemplateIds,
    importingTemplateId,
    listEmptyComponent,
    onImport,
    onPreview,
  } = p;

  const sections: CatalogSection[] = useMemo(
    () =>
      groups.map((group) => ({
        data: group.templates,
        icon: group.icon,
        key: group.category,
        label: group.label,
        subtitle: group.subtitle,
      })),
    [groups]
  );

  // One card shape for every habit, added or not. A compact variant for the
  // "Added" group was tried and reverted: it rendered the same entity two
  // different ways depending on where it sat, dropped the description that
  // makes an added habit recognisable, and gave the habits the user actually
  // committed to the smaller treatment.
  const renderItem: SectionListRenderItem<
    Doc<'templates'>,
    CatalogSection
  > = useCallback(
    ({ item }) => (
      <TemplateReadRow
        isImported={importedTemplateIds.has(item._id)}
        isImporting={importingTemplateId === item._id}
        item={item}
        onImport={onImport}
        onPreview={onPreview}
      />
    ),
    [importedTemplateIds, importingTemplateId, onImport, onPreview]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: CatalogSection }) => (
      <View style={s.header}>
        <SectionHeader
          count={section.data.length}
          icon={section.icon}
          title={section.label}
        />
      </View>
    ),
    []
  );

  return (
    <SectionList
      contentContainerStyle={s.list}
      initialNumToRender={6}
      keyboardDismissMode='on-drag'
      // Without this, the first tap on a card or Add button while the search
      // keyboard is up is consumed by the dismiss and never reaches the row —
      // the button reads as broken and the user has to tap twice.
      keyboardShouldPersistTaps='handled'
      keyExtractor={(item) => item._id}
      ListEmptyComponent={listEmptyComponent}
      maxToRenderPerBatch={6}
      removeClippedSubviews
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      updateCellsBatchingPeriod={32}
      windowSize={5}
    />
  );
}

const s = StyleSheet.create({
  // Stacks with SectionHeader's own paddingHorizontal so the emoji's left
  // edge lines up with the card icon box below.
  header: {
    marginTop: spacing.lg,
    paddingLeft: TEMPLATE_READ_ROW_PADDING,
  },
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
