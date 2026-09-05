/**
 * CatalogFilteredList — full vertical list when a category chip is selected.
 */

import { useCallback, type ReactElement } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { durations, enterEasing } from '../../../theme/animations';
import { spacing } from '../../../theme/spacing';
import { TemplateReadRow } from '../components/ExploreAllSection/TemplateReadRow';

const MAX_STAGGER_INDEX = 4;

interface CatalogFilteredListProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  /** Rendered when the selected category has no matches. */
  listEmptyComponent?: ReactElement;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function CatalogFilteredList(p: CatalogFilteredListProps) {
  const reduceMotion = useReducedMotion();

  // useCallback: as an inline arrow this changed identity every render, so
  // FlatList treated every cell as changed and re-rendered the visible window.
  const renderItem = useCallback(
    ({ index, item }: { index: number; item: Doc<'templates'> }) => {
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
            isImported={p.importedTemplateIds.has(item._id)}
            isImporting={p.importingTemplateId === item._id}
            item={item}
            onImport={p.onImport}
            onPreview={p.onPreview}
          />
        </Animated.View>
      );
    },
    [
      reduceMotion,
      p.importedTemplateIds,
      p.importingTemplateId,
      p.onImport,
      p.onPreview,
    ]
  );

  return (
    <FlatList
      data={p.templates}
      keyboardDismissMode='on-drag'
      // See CatalogSectionList: without this the keyboard dismiss eats the
      // first tap on Add, so adding a searched habit takes two taps.
      keyboardShouldPersistTaps='handled'
      keyExtractor={(item) => item._id}
      ListEmptyComponent={p.listEmptyComponent}
      contentContainerStyle={s.list}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  list: { paddingBottom: spacing['2xl'], paddingTop: spacing.xs },
});
