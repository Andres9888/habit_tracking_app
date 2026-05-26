/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 */

import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { PopularSection } from '../components/PopularSection';
import { StackBuilderBanner } from '../components/StackBuilderBanner';
import { StartHereCard } from '../components/StartHereCard';
import { StarterHabitList } from '../components/StarterHabitList';
import { TransformationPathsSection } from '../components/TransformationPathsSection';
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
  sessionImportCount: number;
  starterTemplates: Doc<'templates'>[];
}

export function BrowseSections(p: BrowseSectionsProps) {
  const showStarterList = p.isFirstTimeUser && p.starterTemplates.length > 0;
  const isReturningUser = !p.isFirstTimeUser;
  let staggerIndex = p.sessionImportCount > 0 ? 3 : 2;

  const nextStagger = () => stagger(staggerIndex++);

  const popularBlock = !showStarterList ? (
    <Animated.View entering={nextStagger()}>
      <PopularSection
        importedTemplateIds={p.importedTemplateIds}
        importingTemplateId={p.importingTemplateId}
        templates={p.popularTemplates}
        onImport={p.onImport}
        onPreview={p.onPreview}
        onSeeAll={p.onSeeAll}
      />
    </Animated.View>
  ) : null;

  const pathsBlock = !showStarterList ? (
    <Animated.View entering={nextStagger()}>
      <TransformationPathsSection
        collapsible={isReturningUser}
        defaultExpanded={!isReturningUser}
        featuredBadgeLabel={p.featuredBadgeLabel}
        featuredGoalId={p.featuredGoalId}
        featuredStarterTemplates={p.featuredStarterTemplates}
        habitCountsByGoalId={p.habitCountsByGoalId}
        onPreviewStarter={p.onPreview}
        onSelectGoal={p.onGoalSelect}
      />
    </Animated.View>
  ) : null;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: spacing['2xl'],
        paddingTop: spacing.md,
      }}
    >
      {p.sessionImportCount > 0 ? (
        <Animated.View entering={stagger(2)}>
          <StackBuilderBanner count={p.sessionImportCount} />
        </Animated.View>
      ) : null}

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
      ) : p.isFirstTimeUser ? (
        <Animated.View entering={stagger(2)}>
          <StartHereCard onPress={p.onStartHerePress} />
        </Animated.View>
      ) : null}

      {isReturningUser ? (
        <>
          {popularBlock}
          {pathsBlock}
        </>
      ) : (
        <>
          {pathsBlock}
          {popularBlock}
        </>
      )}

      <Animated.View entering={nextStagger()}>{p.browseCategoriesLink}</Animated.View>
    </ScrollView>
  );
}
