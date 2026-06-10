/**
 * Props for MainBrowseView (Minimal & Clean redesign)
 */

import type { ReactNode } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { ChipCategory } from '../components/QuickFilterChips';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';

export interface MainBrowseViewProps {
  browseCategoriesLink: ReactNode;
  featuredTemplate: Doc<'templates'> | null;
  feedbackOverlays: ReactNode;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isSearchActive: boolean;
  modals: ReactNode;
  onBrowseByGoal: () => void;
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
  starterTemplates: Doc<'templates'>[];
  userHabitCount: number;
}
