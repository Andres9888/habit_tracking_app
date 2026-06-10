/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 * Workflow V3: transformation-first goal grid on top (warm, emotional
 * choice), then a minimal one-tap quick-start row section (fast path).
 */

import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { GoalCollectionGrid } from '../components/GoalCollectionGrid';
import { StartHereCard } from '../components/StartHereCard';
import { StarterHabitList } from '../components/StarterHabitList';
import type { GoalCollection } from '../data/goalCollections';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';
import { BrowseRowSectionList } from './BrowseRowSectionList';
import { stagger } from './MainBrowseView.helpers';

interface BrowseSectionsProps {
  browseCategoriesLink: ReactNode;
  featuredGoalId: string;
  featuredStarterTemplates: Doc<'templates'>[];
  habitCountsByGoalId: Record<string, number>;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isFirstTimeUser: boolean;
  onBrowseByGoal: () => void;
  onGoalSelect: (goal: GoalCollection) => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  onStartHerePress: () => void;
  rowSections: BrowseRowSection[];
  startedCountsByGoalId: Record<string, number>;
  starterTemplates: Doc<'templates'>[];
}

export function BrowseSections(p: BrowseSectionsProps) {
  const showStarterList = p.isFirstTimeUser && p.starterTemplates.length > 0;

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
      ) : (
        <>
          {p.isFirstTimeUser ? (
            <Animated.View entering={stagger(2)}>
              <StartHereCard onPress={p.onStartHerePress} />
            </Animated.View>
          ) : null}
          <Animated.View entering={stagger(2)}>
            <GoalCollectionGrid
              featuredGoalId={p.featuredGoalId}
              featuredStarterTemplates={p.featuredStarterTemplates}
              habitCountsByGoalId={p.habitCountsByGoalId}
              startedCountsByGoalId={p.startedCountsByGoalId}
              onPreviewStarter={p.onPreview}
              onSelectGoal={p.onGoalSelect}
            />
          </Animated.View>
          <BrowseRowSectionList
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            sections={p.rowSections}
            staggerOffset={3}
            onImport={p.onImport}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
          />
        </>
      )}

      <Animated.View
        entering={stagger(showStarterList ? 3 : 3 + p.rowSections.length)}
      >
        {p.browseCategoriesLink}
      </Animated.View>
    </ScrollView>
  );
}
