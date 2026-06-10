/**
 * GoalDrillView - Slide-in view showing templates across all of a goal's
 * categories. Fixes prior behavior where tapping a multi-category goal
 * only drilled into categories[0].
 */

import { StyleSheet, View } from 'react-native';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { GoalCollection } from '../data/goalCollections';
import { GoalHero } from './GoalHero';
import { GoalPathBody } from './GoalPathBody';

interface GoalDrillViewProps {
  goal: GoalCollection;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onBack: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  templates: Doc<'templates'>[];
}

export function GoalDrillView({
  goal,
  importedTemplateIds,
  importingTemplateId,
  onBack,
  onImport,
  onPreview,
  templates,
}: GoalDrillViewProps) {
  const { colors } = useThemeColors();

  return (
    <View
      testID='templates-goal-view'
      style={[s.container, { backgroundColor: colors.background }]}
    >
      <GoalHero
        goal={goal}
        habitCount={templates.length}
        showPathNote
        onBack={onBack}
      />
      <GoalPathBody
        importedTemplateIds={importedTemplateIds}
        importingTemplateId={importingTemplateId}
        templates={templates}
        onImport={onImport}
        onPreview={onPreview}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
});
