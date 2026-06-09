/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 */

import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ForYouSection } from '../components/ForYouSection';
import type { GoalCollection } from '../data/goalCollections';
import type { RecommendedTemplate } from '../hooks/scoreRecommendedTemplates';
import { BrowseCatalogSections } from './BrowseCatalogSections';
import { BrowseStarterSection } from './BrowseStarterSection';
import { browseStaggerIndex } from './BrowseSections.stagger';
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
  recommendations: RecommendedTemplate[];
  starterTemplates: Doc<'templates'>[];
  weeklyImportCounts?: Record<string, number>;
}

export function BrowseSections(p: BrowseSectionsProps) {
  const showStarterList = p.isFirstTimeUser && p.starterTemplates.length > 0;
  const staggerOpts = {
    isFirstTimeUser: p.isFirstTimeUser,
    recommendationCount: p.recommendations.length,
    showStarterList,
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: spacing['2xl'],
        paddingTop: spacing.md,
      }}
    >
      <BrowseStarterSection
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateId={p.importingTemplateId}
        isFirstTimeUser={p.isFirstTimeUser}
        recommendationCount={p.recommendations.length}
        showStarterList={showStarterList}
        starterTemplates={p.starterTemplates}
        onBrowseByGoal={p.onBrowseByGoal}
        onImport={p.onImport}
        onPreview={p.onPreview}
        onStartHerePress={p.onStartHerePress}
      />
      {!showStarterList && p.recommendations.length > 0 ? (
        <Animated.View
          entering={stagger(
            browseStaggerIndex({ ...staggerOpts, section: 'forYou' })
          )}
        >
          <ForYouSection
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            recommendations={p.recommendations}
            weeklyImportCounts={p.weeklyImportCounts}
            onImport={p.onImport}
            onPreview={p.onPreview}
          />
        </Animated.View>
      ) : null}
      <BrowseCatalogSections
        browseCategoriesLink={p.browseCategoriesLink}
        featuredBadgeLabel={p.featuredBadgeLabel}
        featuredGoalId={p.featuredGoalId}
        featuredStarterTemplates={p.featuredStarterTemplates}
        habitCountsByGoalId={p.habitCountsByGoalId}
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateId={p.importingTemplateId}
        isFirstTimeUser={p.isFirstTimeUser}
        popularTemplates={p.popularTemplates}
        recommendationCount={p.recommendations.length}
        showStarterList={showStarterList}
        weeklyImportCounts={p.weeklyImportCounts}
        onGoalSelect={p.onGoalSelect}
        onImport={p.onImport}
        onPreview={p.onPreview}
        onSeeAll={p.onSeeAll}
      />
    </ScrollView>
  );
}
