/**
 * Props for MainBrowseView (goal-first redesign)
 */

import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { GoalCollection } from '../data/goalCollections';

export interface MainBrowseViewProps {
  browseAllCategoriesPreviewIcons: string[];
  browseAllCategoriesTotalCount: number;
  browseAllCategoryCount: number;
  exploreAllSection: ReactNode;
  featuredBadgeLabel?: string;
  featuredGoalId: string;
  feedbackOverlays: ReactNode;
  habitCountsByGoalId: Record<string, number>;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  modals: ReactNode;
  onGoalSelect: (goal: GoalCollection) => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSeeAll: () => void;
  popularTemplates: Doc<'templates'>[];
  premiumPacksSection: ReactNode;
  searchAnimatedStyle: AnimatedStyle<ViewStyle>;
  searchQuery: string;
}
