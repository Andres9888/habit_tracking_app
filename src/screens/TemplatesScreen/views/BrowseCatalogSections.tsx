/**
 * Goal grid, popular rail, and categories link for library browse.
 */

import type { ReactNode } from 'react';
import Animated from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { GoalCollectionGrid } from '../components/GoalCollectionGrid';
import { PopularSection } from '../components/PopularSection';
import type { GoalCollection } from '../data/goalCollections';
import { browseStaggerIndex } from './BrowseSections.stagger';
import { stagger } from './MainBrowseView.helpers';

interface BrowseCatalogSectionsProps {
  browseCategoriesLink: ReactNode;
  featuredBadgeLabel?: string;
  featuredGoalId: string;
  featuredStarterTemplates: Doc<'templates'>[];
  habitCountsByGoalId: Record<string, number>;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isFirstTimeUser: boolean;
  onGoalSelect: (goal: GoalCollection) => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  popularTemplates: Doc<'templates'>[];
  recommendationCount: number;
  showStarterList: boolean;
  weeklyImportCounts?: Record<string, number>;
}

export function BrowseCatalogSections(p: BrowseCatalogSectionsProps) {
  if (p.showStarterList) return null;

  const staggerOpts = {
    isFirstTimeUser: p.isFirstTimeUser,
    recommendationCount: p.recommendationCount,
    showStarterList: p.showStarterList,
  };

  return (
    <>
      <Animated.View
        entering={stagger(
          browseStaggerIndex({ ...staggerOpts, section: 'goals' })
        )}
      >
        <GoalCollectionGrid
          featuredBadgeLabel={p.featuredBadgeLabel}
          featuredGoalId={p.featuredGoalId}
          featuredStarterTemplates={p.featuredStarterTemplates}
          habitCountsByGoalId={p.habitCountsByGoalId}
          onPreviewStarter={p.onPreview}
          onSelectGoal={p.onGoalSelect}
        />
      </Animated.View>
      <Animated.View
        entering={stagger(
          browseStaggerIndex({ ...staggerOpts, section: 'popular' })
        )}
      >
        <PopularSection
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          templates={p.popularTemplates}
          weeklyImportCounts={p.weeklyImportCounts}
          onImport={p.onImport}
          onPreview={p.onPreview}
          onSeeAll={p.onSeeAll}
        />
      </Animated.View>
      <Animated.View
        entering={stagger(
          browseStaggerIndex({ ...staggerOpts, section: 'browseLink' })
        )}
      >
        {p.browseCategoriesLink}
      </Animated.View>
    </>
  );
}
