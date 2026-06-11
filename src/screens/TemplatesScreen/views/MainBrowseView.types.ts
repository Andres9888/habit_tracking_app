/**
 * Props for MainBrowseView (The Guide: intake hero + short browse page)
 */

import type { ReactNode } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { CategoryIndexItem } from '../components/CategoryIndexGrid';
import type { GoalCollection } from '../data/goalCollections';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';

export interface MainBrowseViewProps {
  categoryIndex: CategoryIndexItem[];
  feedbackOverlays: ReactNode;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isSearchActive: boolean;
  modals: ReactNode;
  onBrowseByGoal: () => void;
  onGoalSelect: (goal: GoalCollection) => void;
  onImport: (template: Doc<'templates'>) => void;
  onOpenCategory: (categoryId: string) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSeeAll: () => void;
  onStartHerePress: () => void;
  rowSections: BrowseRowSection[];
  searchQuery: string;
  searchResultsSection: ReactNode;
  selectedCategory: string;
  starterTemplates: Doc<'templates'>[];
  totalHabitCount: number;
  userHabitCount: number;
}
