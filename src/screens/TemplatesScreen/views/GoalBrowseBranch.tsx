/**
 * GoalBrowseBranch — prescription card + goal habit rows when a chip is selected.
 */

import Animated from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { HabitTemplateCard } from '../components/HabitTemplateCard';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { SectionOverline } from '../components/SectionOverline';
import type { GoalCollection } from '../data/goalCollections';
import type { ResolvedPrescription } from '../hooks/usePrescription';

interface GoalBrowseBranchProps {
  goal: GoalCollection;
  goalTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onGoalListImport: (template: Doc<'templates'>) => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  prescription: ResolvedPrescription;
}

export function GoalBrowseBranch(p: GoalBrowseBranchProps) {
  return (
    <>
      <PrescriptionCard
        key={p.goal.id}
        goal={p.goal}
        importedTemplateIds={p.importedTemplateIds}
        prescription={p.prescription}
        onImport={p.onImport}
        onPreview={p.onPreview}
      />
      <SectionOverline
        title={`All ${p.goal.problemLabel.toLowerCase()} habits · ${p.goalTemplates.length}`}
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
