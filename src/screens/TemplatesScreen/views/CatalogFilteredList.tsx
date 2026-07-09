/**
 * CatalogFilteredList — full vertical list when a category chip is selected.
 */

import { FlatList, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { durations, enterEasing } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { TemplateReadRow } from '../components/ExploreAllSection/TemplateReadRow';

const MAX_STAGGER_INDEX = 4;

interface CatalogFilteredListProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function CatalogFilteredList(p: CatalogFilteredListProps) {
  const reduceMotion = useReduceMotion();

  return (
    <FlatList
      data={p.templates}
      keyboardDismissMode='on-drag'
      keyExtractor={(item) => item._id}
      contentContainerStyle={s.list}
      renderItem={({ index, item }) => {
        const entering =
          !reduceMotion && index <= MAX_STAGGER_INDEX
            ? FadeInDown.delay(
                Math.min(index, MAX_STAGGER_INDEX) * durations.stagger
              )
                .duration(durations.enter)
                .easing(enterEasing)
            : undefined;

        return (
          <Animated.View entering={entering}>
            <TemplateReadRow
              importedTemplateIds={p.importedTemplateIds}
              importingTemplateId={p.importingTemplateId}
              item={item}
              onImport={p.onImport}
              onPreview={p.onPreview}
            />
          </Animated.View>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
