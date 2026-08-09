/**
 * CatalogFilteredBranch — keyed filtered list with enter/exit on category switch.
 */

import type { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import {
  durations,
  enterEasing,
  exitEasing,
} from '../../../theme/animations';
import { CatalogFilteredList } from './CatalogFilteredList';
import type { OnTemplatePreview } from '../TemplatesScreen.types';

interface CatalogFilteredBranchProps {
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  listEmptyComponent?: ReactElement;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: OnTemplatePreview;
  selectedCategoryId: string;
  templates: Doc<'templates'>[];
}

export function CatalogFilteredBranch(p: CatalogFilteredBranchProps) {
  const reduceMotion = useReduceMotion();
  const entering = reduceMotion
    ? undefined
    : FadeInDown.duration(durations.enter).easing(enterEasing);
  const exiting = reduceMotion
    ? undefined
    : FadeOut.duration(durations.quick).easing(exitEasing);

  return (
    <Animated.View
      key={p.selectedCategoryId}
      entering={entering}
      exiting={exiting}
      style={s.branch}
    >
      <CatalogFilteredList
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateId={p.importingTemplateId}
        listEmptyComponent={p.listEmptyComponent}
        templates={p.templates}
        onImport={p.onImport}
        onPreview={p.onPreview}
      />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  branch: { flex: 1 },
});
