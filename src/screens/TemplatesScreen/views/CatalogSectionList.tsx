/**
 * CatalogSectionList — vertical category-grouped list for the "All" catalog.
 * Replaces the Netflix shelf carousel: each category is a SectionHeader
 * followed by full-width HabitTemplateCard rows (matching the rest of the app).
 */

import { useCallback, useMemo } from 'react';
import type { SectionListRenderItem } from 'react-native';
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
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

interface CatalogSection {
  data: Doc<'templates'>[];
  icon: string;
  iconBg: string;
  key: string;
  label: string;
}

export function CatalogSectionList(p: CatalogSectionListProps) {
  const {
    groups,
    importedTemplateIds,
    importingTemplateId,
    onImport,
    onPreview,
  } = p;

  const sections: CatalogSection[] = useMemo(
    () =>
      groups.map((group) => {
        const meta = getCategoryMeta(group.category);
        return {
          data: group.templates,
          icon: group.icon,
          iconBg: meta.bgColor,
          key: group.category,
          label: group.label,
        };
      }),
    [groups]
  );

  const renderItem: SectionListRenderItem<
    Doc<'templates'>,
    CatalogSection
  > = useCallback(
    ({ item }) => (
      <TemplateReadRow
        importedTemplateIds={importedTemplateIds}
        importingTemplateId={importingTemplateId}
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
          icon={section.icon}
          iconBg={section.iconBg}
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
      keyExtractor={(item) => item._id}
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
  // Extra left padding stacks with SectionHeader's own paddingHorizontal so
  // the icon box's left edge lines up with the card icon box below
  // (cardWrap.marginHorizontal + header.padding = spacing.base * 2).
  header: { marginTop: spacing.lg, paddingLeft: spacing.base },
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
