/**
 * Props for MainBrowseView (The Guide: intake hero + short browse page)
 */

import type { ReactNode } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { CategoryIndexItem } from '../components/CategoryIndexGrid';
import type { GoalCollection } from '../data/goalCollections';
import type { ResolvedPrescription } from '../hooks/usePrescription';
import type { BrowseRowSection } from '../hooks/useMainBrowseData';

export interface MainBrowseViewProps {
  categoryIndex: CategoryIndexItem[];
  feedbackOverlays: ReactNode;
  goalTemplates: Doc<'templates'>[];
  heroSubtitle?: string;
  heroTitle?: string;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isSearchActive: boolean;
  modals: ReactNode;
  onGoalSelect: (goal: GoalCollection) => void;
  onOpenCategory: (categoryId: string) => void;
  onPopularImport: (template: Doc<'templates'>) => void;
  onPrescriptionImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSeeAll: () => void;
  prescription: ResolvedPrescription | null;
  rowSections: BrowseRowSection[];
  searchQuery: string;
  searchResultsSection: ReactNode;
  selectedCategory: string;
  selectedGoalId: string | null;
  totalHabitCount: number;
}
