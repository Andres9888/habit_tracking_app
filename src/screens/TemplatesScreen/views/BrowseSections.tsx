/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 * Minimal & Clean: one featured pick, then quiet row sections.
 */

import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { FeaturedPickCard } from '../components/FeaturedPickCard';
import { StartHereCard } from '../components/StartHereCard';
import { StarterHabitList } from '../components/StarterHabitList';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';
import { BrowseRowSectionList } from './BrowseRowSectionList';
import { stagger } from './MainBrowseView.helpers';

interface BrowseSectionsProps {
  browseCategoriesLink: ReactNode;
  featuredTemplate: Doc<'templates'> | null;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isFirstTimeUser: boolean;
  onBrowseByGoal: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  onStartHerePress: () => void;
  rowSections: BrowseRowSection[];
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
          {p.featuredTemplate ? (
            <Animated.View entering={stagger(2)}>
              <FeaturedPickCard
                isImported={p.importedTemplateIds.has(p.featuredTemplate._id)}
                isImporting={p.importingTemplateId === p.featuredTemplate._id}
                template={p.featuredTemplate}
                onImport={p.onImport}
                onPreview={p.onPreview}
              />
            </Animated.View>
          ) : null}
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
