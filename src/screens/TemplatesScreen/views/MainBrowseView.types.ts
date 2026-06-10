/**
 * Props for MainBrowseView (Workflow V3: transformation-first + fast path)
 */

import type { ReactNode } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { ChipCategory } from '../components/QuickFilterChips';
import type { GoalCollection } from '../data/goalCollections';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';

export interface MainBrowseViewProps {
  browseCategoriesLink: ReactNode;
  featuredGoalId: string;
  featuredStarterTemplates: Doc<'templates'>[];
  feedbackOverlays: ReactNode;
  habitCountsByGoalId: Record<string, number>;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isSearchActive: boolean;
  modals: ReactNode;
  onBrowseByGoal: () => void;
  onGoalSelect: (goal: GoalCollection) => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSeeAll: () => void;
  onSelectCategory: (categoryId: string | null) => void;
  onStartHerePress: () => void;
  quickFilterCategories: ChipCategory[];
  rowSections: BrowseRowSection[];
  searchQuery: string;
  searchResultsSection: ReactNode;
  selectedCategory: string;
  startedCountsByGoalId: Record<string, number>;
  starterTemplates: Doc<'templates'>[];
  userHabitCount: number;
}
