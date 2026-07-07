/**
 * CatalogSectionList — vertical category-grouped list for the "All" catalog.
 * Replaces the Netflix shelf carousel: each category is a SectionHeader
 * followed by full-width HabitTemplateCard rows (matching the rest of the app).
 */

import { SectionList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { durations, enterEasing } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { HabitTemplateCard } from '../components/HabitTemplateCard';
import { SectionHeader } from '../components/SectionHeader';
import type { CategoryGroup } from '../components/ExploreAllSection/ExploreAllSection.types';
import { getCategoryMeta } from '../data/categoryMeta';

/** Cap staggered entrance to the first few items per section (perf). */
const MAX_STAGGER_INDEX = 4;

interface CatalogSectionListProps {
  groups: CategoryGroup[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
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
  const reduceMotion = useReduceMotion();
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
      renderItem={({ item, index }) => (
        <Animated.View
          entering={
            reduceMotion
              ? undefined
              : FadeInDown.delay(
                  Math.min(index, MAX_STAGGER_INDEX) * durations.stagger
                )
                  .duration(durations.enter)
                  .easing(enterEasing)
          }
        >
          <HabitTemplateCard
            descriptionLines={3}
            isImported={p.importedTemplateIds.has(item._id)}
            isImporting={p.importingTemplateId === item._id}
            item={item}
            onImport={p.onImport}
            onPreview={p.onPreview}
          />
        </Animated.View>
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
