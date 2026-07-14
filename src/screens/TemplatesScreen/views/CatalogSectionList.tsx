/**
 * CatalogSectionList — vertical category-grouped list for the "All" catalog.
 * Replaces the Netflix shelf carousel: each category is a SectionHeader
 * followed by full-width HabitTemplateCard rows (matching the rest of the app).
 */

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

export function CatalogSectionList(p: CatalogSectionListProps) {
  const sections: CatalogSection[] = p.groups.map((group) => ({
    data: group.templates,
    key: group.category,
    label: `${group.icon} ${group.label}`,
    subtitle: getCategoryMeta(group.category).subtitle,
  }));

  return (
    <SectionList
      contentContainerStyle={s.list}
      keyboardDismissMode='on-drag'
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TemplateReadRow
          isImported={p.importedTemplateIds.has(item._id)}
          isImporting={p.importingTemplateIds.has(item._id)}
          item={item}
          onImport={p.onImport}
          onPreview={p.onPreview}
        />
      )}
      renderSectionHeader={({ section }) => (
        <View style={s.header}>
          <SectionHeader subtitle={section.subtitle} title={section.label} />
        </View>
      )}
      sections={sections}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
    />
  );
}

const s = StyleSheet.create({
  header: { marginTop: spacing.lg },
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
