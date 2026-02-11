/**
 * Type definitions for BrowseView
 */

import type { AnimatedStyle } from 'react-native-reanimated';
import type { LayoutChangeEvent, ScrollView } from 'react-native';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import type { SortOption } from '../../templates/constants';
import type {
  BrowseTab,
  TemplateCustomizations,
} from '../TemplatesScreen.types';

export interface BrowseViewAnimations {
  contentAnimatedStyle: AnimatedStyle;
  headerAnimatedStyle: AnimatedStyle;
  searchAnimatedStyle: AnimatedStyle;
  tabBarAnimatedStyle: AnimatedStyle;
}

export interface BrowseViewHandlers {
  handleCustomizeFromPreview: (template: Doc<'templates'>) => void;
  handleDirectImport: (templateId: Id<'templates'>) => Promise<void>;
  handleSelectSortOption: (option: SortOption) => void;
  handleTemplateImport: (
    templateId: Id<'templates'>,
    c?: TemplateCustomizations
  ) => Promise<void>;
  handleTemplatePreview: (template: Doc<'templates'>) => void;
  handleToggleCategory: (categoryId: string) => void;
}

export interface BrowseViewProps {
  animations: BrowseViewAnimations;
  browseTab: BrowseTab;
  categories: { icon: string; id: string; label: string }[] | undefined;
  expandedCategories: Set<string>;
  filteredTemplates: Doc<'templates'>[];
  handlers: BrowseViewHandlers;
  importedTemplateIds: Set<string>;
  importingTemplateId: Id<'templates'> | null;
  onCloseSortOptions: () => void;
  onTabPress: (tab: BrowseTab) => void;
  previewTemplate: Doc<'templates'> | null;
  researchOnly: boolean;
  scienceCountsByCategory: Record<string, number>;
  scrollViewRef: React.RefObject<ScrollView | null>;
  searchQuery: string;
  setResearchOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowCustomizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFullsizePreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSortOptions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  showCustomizeModal: boolean;
  showFullsizePreview: boolean;
  showSortOptions: boolean;
  showToast: boolean;
  sortOption: SortOption;
  tabIndicator: {
    handleTabBarLayout: (e: LayoutChangeEvent) => void;
    tabIndicatorStyle: AnimatedStyle;
  };
  templatesByCategory: Map<string, Doc<'templates'>[]>;
  toastMessage: string;
  totalCount: number;
}
