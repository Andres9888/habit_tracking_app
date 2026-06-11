/**
 * BrowseSections — scroll content for MainBrowseView's non-filtered branch.
 * The Guide layout: the hero asks the question (chips live there); below
 * it the page stays short — popular one-tap rows, a compact category
 * index, and one endcap link into the full catalog.
 */

import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { spacing } from '../../../theme/spacing';
import type { Doc } from '../../../../convex/_generated/dataModel';
import {
  CategoryIndexGrid,
  type CategoryIndexItem,
} from '../components/CategoryIndexGrid';
import { LibraryEndcap } from '../components/LibraryEndcap';
import { SectionOverline } from '../components/SectionOverline';
import { StartHereCard } from '../components/StartHereCard';
import { StarterHabitList } from '../components/StarterHabitList';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';
import { BrowseRowSectionList } from './BrowseRowSectionList';
import { stagger } from './MainBrowseView.helpers';

interface BrowseSectionsProps {
  categoryIndex: CategoryIndexItem[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isFirstTimeUser: boolean;
  onBrowseByGoal: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onOpenCategory: (categoryId: string) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  onStartHerePress: () => void;
  rowSections: BrowseRowSection[];
  starterTemplates: Doc<'templates'>[];
  totalHabitCount: number;
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
          <BrowseRowSectionList
            importedTemplateIds={p.importedTemplateIds}
            importingTemplateId={p.importingTemplateId}
            sections={p.rowSections}
            staggerOffset={2}
            onImport={p.onImport}
            onPreview={p.onPreview}
            onSeeAll={p.onSeeAll}
          />
          {p.categoryIndex.length > 0 ? (
            <Animated.View entering={stagger(3)}>
              <SectionOverline title='By category' />
              <CategoryIndexGrid
                categories={p.categoryIndex}
                onSelectCategory={p.onOpenCategory}
              />
            </Animated.View>
          ) : null}
          <Animated.View entering={stagger(4)}>
            <LibraryEndcap
              totalHabitCount={p.totalHabitCount}
              onPress={p.onSeeAll}
            />
          </Animated.View>
        </>
      )}
    </ScrollView>
  );
}
