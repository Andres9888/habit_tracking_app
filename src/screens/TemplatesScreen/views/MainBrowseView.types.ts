/**
 * Props for MainBrowseView (goal-first redesign)
 */

import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { ChipCategory } from '../components/QuickFilterChips';
import type { GoalCollection } from '../data/goalCollections';

export interface MainBrowseViewProps {
  browseCategoriesLink: ReactNode;
  featuredBadgeLabel?: string;
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
  popularTemplates: Doc<'templates'>[];
  quickFilterCategories: ChipCategory[];
  searchAnimatedStyle: AnimatedStyle<ViewStyle>;
  searchQuery: string;
  searchResultsSection: ReactNode;
  selectedCategory: string;
  sessionImportCount: number;
  starterTemplates: Doc<'templates'>[];
  userHabitCount: number;
}
