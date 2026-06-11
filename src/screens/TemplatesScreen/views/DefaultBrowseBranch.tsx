/**
 * DefaultBrowseBranch — popular rows, category index, and endcap.
 */

import Animated from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import {
  CategoryIndexGrid,
  type CategoryIndexItem,
} from '../components/CategoryIndexGrid';
import { LibraryEndcap } from '../components/LibraryEndcap';
import { SectionOverline } from '../components/SectionOverline';
import { StartHereCard } from '../components/StartHereCard';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';
import { BrowseRowSectionList } from './BrowseRowSectionList';
import { stagger } from './MainBrowseView.helpers';

interface DefaultBrowseBranchProps {
  categoryIndex: CategoryIndexItem[];
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isFirstTimeUser: boolean;
  onImport: (template: Doc<'templates'>) => void;
  onOpenCategory: (categoryId: string) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSeeAll: () => void;
  onStartHerePress: () => void;
  rowSections: BrowseRowSection[];
  totalHabitCount: number;
}

export function DefaultBrowseBranch(p: DefaultBrowseBranchProps) {
  return (
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
  );
}
