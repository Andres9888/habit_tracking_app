/**
 * Props for MainBrowseView
 */

import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { ChipCategory } from '../components/QuickFilterChips';

export interface MainBrowseViewProps {
  categoryGrid: ReactNode;
  exploreAllSection: ReactNode;
  featuredHabitCount: number;
  feedbackOverlays: ReactNode;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  modals: ReactNode;
  onFeaturedPress: (categoryId: string) => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSelectQuickFilter: (categoryId: string | null) => void;
  onSeeAll: () => void;
  popularTemplates: Doc<'templates'>[];
  premiumPacksSection: ReactNode;
  quickFilterCategories: ChipCategory[];
  searchAnimatedStyle: AnimatedStyle<ViewStyle>;
  searchQuery: string;
  selectedQuickFilter: string | null;
}
