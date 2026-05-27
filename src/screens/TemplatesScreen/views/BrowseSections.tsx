/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 */

import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { GoalCollectionGrid } from '../components/GoalCollectionGrid';
import { PopularSection } from '../components/PopularSection';
import { StartHereCard } from '../components/StartHereCard';
import { StarterHabitList } from '../components/StarterHabitList';
import { TransformationGuideCard } from '../components/TransformationGuideCard';
import type { GoalCollection } from '../data/goalCollections';
import { stagger } from './MainBrowseView.helpers';

interface BrowseSectionsProps {
  browseCategoriesLink: ReactNode;
  featuredBadgeLabel?: string;
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
  popularTemplates: Doc<'templates'>[];
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
      <Animated.View entering={stagger(2)}>
        <TransformationGuideCard />
        {showStarterList ? (
          <StarterHabitList
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            templates={p.starterTemplates}
            onBrowseByGoal={p.onBrowseByGoal}
            onImport={p.onImport}
            onPreview={p.onPreview}
          />
        ) : p.isFirstTimeUser ? (
          <StartHereCard onPress={p.onStartHerePress} />
        ) : null}
      </Animated.View>

      {!showStarterList ? (
        <Animated.View entering={stagger(p.isFirstTimeUser ? 3 : 2)}>
          <GoalCollectionGrid
            featuredBadgeLabel={p.featuredBadgeLabel}
            featuredGoalId={p.featuredGoalId}
            featuredStarterTemplates={p.featuredStarterTemplates}
            habitCountsByGoalId={p.habitCountsByGoalId}
            onPreviewStarter={p.onPreview}
            onSelectGoal={p.onGoalSelect}
          />
        </Animated.View>
      ) : null}

      {!showStarterList ? (
        <Animated.View entering={stagger(p.isFirstTimeUser ? 4 : 3)}>
          <PopularSection
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            templates={p.popularTemplates}
            onImport={p.onImport}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
          />
        </Animated.View>
      ) : null}

      <Animated.View entering={stagger(showStarterList ? 3 : p.isFirstTimeUser ? 5 : 4)}>
        {p.browseCategoriesLink}
      </Animated.View>
    </ScrollView>
  );
}
