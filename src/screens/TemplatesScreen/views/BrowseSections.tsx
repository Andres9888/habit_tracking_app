/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 */

import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { type CategoryIndexItem } from '../components/CategoryIndexGrid';
import { StarterHabitList } from '../components/StarterHabitList';
import { GOAL_COLLECTIONS } from '../data/goalCollections';
import type { ResolvedPrescription } from '../hooks/usePrescription';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';
import { DefaultBrowseBranch } from './DefaultBrowseBranch';
import { GoalBrowseBranch } from './GoalBrowseBranch';
import { stagger } from './MainBrowseView.helpers';

interface BrowseSectionsProps {
  categoryIndex: CategoryIndexItem[];
  goalTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isFirstTimeUser: boolean;
  onBrowseByGoal: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onOpenCategory: (categoryId: string) => void;
  onOpenGoal: (goalId: string) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  onStartHerePress: () => void;
  prescription: ResolvedPrescription | null;
  rowSections: BrowseRowSection[];
  selectedGoalId: string | null;
  starterTemplates: Doc<'templates'>[];
  totalHabitCount: number;
}

export function BrowseSections(p: BrowseSectionsProps) {
  const showStarterList = p.isFirstTimeUser && p.starterTemplates.length > 0;
  const selectedGoal = p.selectedGoalId
    ? GOAL_COLLECTIONS.find((g) => g.id === p.selectedGoalId)
    : null;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: spacing['2xl'],
        paddingTop: spacing.md,
      }}
    >
      {showStarterList ? (
        <Animated.View entering={stagger(2)}>
          <StarterHabitList
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            templates={p.starterTemplates}
            onBrowseByGoal={p.onBrowseByGoal}
            onImport={p.onImport}
            onPreview={p.onPreview}
          />
        </Animated.View>
      ) : selectedGoal && p.prescription ? (
        <Animated.View entering={stagger(2)}>
          <GoalBrowseBranch
            goal={selectedGoal}
            goalTemplates={p.goalTemplates}
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            prescription={p.prescription}
            onImport={p.onImport}
            onOpenGoal={p.onOpenGoal}
            onPreview={p.onPreview}
          />
        </Animated.View>
      ) : (
        <DefaultBrowseBranch
          categoryIndex={p.categoryIndex}
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          isFirstTimeUser={p.isFirstTimeUser}
          rowSections={p.rowSections}
          totalHabitCount={p.totalHabitCount}
          onImport={p.onImport}
          onOpenCategory={p.onOpenCategory}
          onPreview={p.onPreview}
          onSeeAll={p.onSeeAll}
          onStartHerePress={p.onStartHerePress}
        />
      )}
    </ScrollView>
  );
}
