/**
 * GoalBrowseBranch — goal habit rows when a chip is selected.
 */

import Animated from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { HabitTemplateCard } from '../components/HabitTemplateCard';
import { SectionOverline } from '../components/SectionOverline';
import type { GoalCollection } from '../data/goalCollections';

interface GoalBrowseBranchProps {
  goal: GoalCollection;
  goalTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onGoalListImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
}

export function GoalBrowseBranch(p: GoalBrowseBranchProps) {
  return (
    <>
      <SectionOverline
        title={`${p.goal.problemLabel} habits`}
      />
      <Animated.View key={`${p.goal.id}-templates`}>
        {p.goalTemplates.map((item) => (
          <HabitTemplateCard
            key={item._id}
            isImported={p.importedTemplateIds.has(item._id)}
            isImporting={p.importingTemplateId === item._id}
            item={item}
            onImport={p.onGoalListImport}
            onPreview={p.onPreview}
          />
        ))}
      </Animated.View>
    </>
  );
}
