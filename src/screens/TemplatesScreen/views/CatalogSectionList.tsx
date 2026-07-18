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
  subtitle?: string;
}

export function CatalogSectionList(p: CatalogSectionListProps) {
  const sections: CatalogSection[] = p.groups.map((group) => {
    const meta = getCategoryMeta(group.category);
    return {
      data: group.templates,
      icon: group.icon,
      iconBg: meta.bgColor,
      key: group.category,
      label: group.label,
      subtitle: meta.subtitle,
    };
  });

  return (
    <SectionList
      contentContainerStyle={s.list}
      keyboardDismissMode='on-drag'
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TemplateReadRow
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          item={item}
          onImport={p.onImport}
          onPreview={p.onPreview}
        />
      )}
      renderSectionHeader={({ section }) => (
        <View style={s.header}>
          <SectionHeader
            icon={section.icon}
            iconBg={section.iconBg}
            subtitle={section.subtitle}
            title={section.label}
          />
        </View>
      )}
      sections={sections}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
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
