/**
 * GoalBrowseBranch — prescription card + goal habit rows when a chip is selected.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { MinimalTemplateRow } from '../components/MinimalTemplateRow';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { SectionOverline } from '../components/SectionOverline';
import type { GoalCollection } from '../data/goalCollections';
import type { ResolvedPrescription } from '../hooks/usePrescription';

interface GoalBrowseBranchProps {
  goal: GoalCollection;
  goalTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onImport: (template: Doc<'templates'>) => void;
  onOpenGoal: (goalId: string) => void;
  onPreview: (template: Doc<'templates'>) => void;
  prescription: ResolvedPrescription;
}

export function GoalBrowseBranch(p: GoalBrowseBranchProps) {
  const { colors } = useThemeColors();

  return (
    <>
      <PrescriptionCard
        goal={p.goal}
        importedTemplateIds={p.importedTemplateIds}
        prescription={p.prescription}
        onImport={p.onImport}
        onPreview={p.onPreview}
      />
      <SectionOverline
        title={`All ${p.goal.problemLabel.toLowerCase()} habits · ${p.goalTemplates.length}`}
        rightSlot={
          <Pressable
            accessibilityLabel={`See all ${p.goal.problemLabel} habits`}
            accessibilityRole='button'
            hitSlop={8}
            onPress={() => p.onOpenGoal(p.goal.id)}
          >
            <Text style={[s.seeAll, { color: colors.primary[600] }]}>
              See all ›
            </Text>
          </Pressable>
        }
      />
      <View>
        {p.goalTemplates.map((item) => (
          <MinimalTemplateRow
            key={item._id}
            isImported={p.importedTemplateIds.has(item._id)}
            isImporting={p.importingTemplateId === item._id}
            item={item}
            onImport={p.onImport}
            onPreview={p.onPreview}
          />
        ))}
      </View>
    </>
  );
}

const s = StyleSheet.create({
  seeAll: { ...typography.bodySmall },
});
