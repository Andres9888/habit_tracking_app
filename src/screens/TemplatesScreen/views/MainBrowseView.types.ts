/**
 * Props for MainBrowseView
 */

import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { Doc } from '../../../../convex/_generated/dataModel';

export interface MainBrowseViewProps {
  categoryGrid: ReactNode;
  feedbackOverlays: ReactNode;
  headerAnimatedStyle: AnimatedStyle<ViewStyle>;
  importedTemplateIds: Set<string>;
  importingTemplateId: string | null;
  isPremiumUser: boolean;
  modals: ReactNode;
  onFeaturedPress: () => void;
  onImport: (template: Doc<'templates'>) => void;
  onPreview: (template: Doc<'templates'>) => void;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  onSeeAll: () => void;
  onShowPaywall?: () => void;
  popularTemplates: Doc<'templates'>[];
  premiumPacksSection: ReactNode;
  searchAnimatedStyle: AnimatedStyle<ViewStyle>;
  searchQuery: string;
  userHabitCount: number;
}
