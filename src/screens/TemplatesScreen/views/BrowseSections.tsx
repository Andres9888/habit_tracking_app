/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 *
 * Owns: StartHereCard (conditional) → GoalCollectionGrid → PopularSection →
 * PremiumPacks (gated) → ExploreAll. Stagger indices shift up when
 * StartHereCard is shown so subsequent sections animate after it.
 */

import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { GoalCollectionGrid } from '../components/GoalCollectionGrid';
import { PopularSection } from '../components/PopularSection';
import { StartHereCard } from '../components/StartHereCard';
import type { GoalCollection } from '../data/goalCollections';
import { stagger } from './MainBrowseView.helpers';

interface BrowseSectionsProps {
  exploreAllSection: ReactNode;
  featuredBadgeLabel?: string;
  featuredGoalId: string;
  featuredStarterTemplates: Doc<'templates'>[];
  habitCountsByGoalId: Record<string, number>;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  onGoalSelect: (goal: GoalCollection) => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  onStartHerePress: () => void;
  popularTemplates: Doc<'templates'>[];
  premiumPacksSection: ReactNode;
  showPremiumPacks: boolean;
  showStartHere: boolean;
}

export function BrowseSections(p: BrowseSectionsProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: spacing['2xl'],
        paddingTop: spacing.md,
      }}
    >
      {p.showStartHere ? (
        <Animated.View entering={stagger(2)}>
          <StartHereCard onPress={p.onStartHerePress} />
        </Animated.View>
      ) : null}
      <Animated.View entering={stagger(p.showStartHere ? 3 : 2)}>
        <GoalCollectionGrid
          featuredBadgeLabel={p.featuredBadgeLabel}
          featuredGoalId={p.featuredGoalId}
          featuredStarterTemplates={p.featuredStarterTemplates}
          habitCountsByGoalId={p.habitCountsByGoalId}
          onPreviewStarter={p.onPreview}
          onSelectGoal={p.onGoalSelect}
        />
      </Animated.View>
      {p.showPremiumPacks ? (
        <Animated.View entering={stagger(p.showStartHere ? 4 : 3)}>
          {p.premiumPacksSection}
        </Animated.View>
      ) : null}
      <Animated.View entering={stagger(p.showStartHere ? 4 : 3)}>
        <PopularSection
          importedTemplateIds={p.importedTemplateIds}
          importingTemplateId={p.importingTemplateId}
          templates={p.popularTemplates}
          onImport={p.onImport}
          onPreview={p.onPreview}
          onSeeAll={p.onSeeAll}
        />
      </Animated.View>
      <Animated.View entering={stagger(p.showStartHere ? 5 : 4)}>
        {p.exploreAllSection}
      </Animated.View>
    </ScrollView>
  );
}
