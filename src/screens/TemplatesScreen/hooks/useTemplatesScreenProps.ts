/**
 * Hook to prepare props for TemplatesScreen child views
 */

import { useReduceMotion } from '../../../hooks/useReduceMotion';
import {
  useEntranceAnimations,
  useTabIndicator,
} from '../TemplatesScreen.animations';
import { useTemplateHandlers } from '../TemplatesScreen.handlers';
import { useTemplatesScreenState } from '../TemplatesScreen.hooks';
import type { BrowseTab } from '../TemplatesScreen.types';
import {
  useFilteredTemplates,
  useScienceCountsByCategory,
  useTemplatesByCategory,
  useTemplatesData,
} from '../useTemplatesData';
import { useMainBrowseData } from './useMainBrowseData';
import { usePackConfirm } from './usePackConfirm';
import { useViewNavigation } from './useViewNavigation';

export function useTemplatesScreenProps() {
  const reducedMotion = useReduceMotion();
  const animations = useEntranceAnimations({ reducedMotion });
  const tabIndicator = useTabIndicator({ reducedMotion });
  const data = useTemplatesData();
  const state = useTemplatesScreenState({ categories: data.categories });

  const templatesByCategory = useTemplatesByCategory(data.allTemplates);
  const scienceCountsByCategory = useScienceCountsByCategory(data.allTemplates);
  const filteredTemplates = useFilteredTemplates(
    data.allTemplates,
    state.selectedCategory,
    state.researchOnly,
    state.searchQuery,
    state.sortOption
  );

  const handlers = useTemplateHandlers({
    flatListRef: state.flatListRef,
    importTemplate: data.importTemplate,
    previewTemplate: state.previewTemplate,
    isPremiumUser: data.isPremiumUser,
    onShowPaywall: () => state.setShowPaywall(true),
    seedTemplates: data.seedTemplates,
    setShowCelebration: state.setShowCelebration,
    setExpandedCategories: state.setExpandedCategories,
    setImportedTemplateIds: state.setImportedTemplateIds,
    setImportingTemplateId: state.setImportingTemplateId,
    setIsSeeding: state.setIsSeeding,
    setPreviewTemplate: state.setPreviewTemplate,
    setResearchOnly: state.setResearchOnly,
    setSearchQuery: state.setSearchQuery,
    setSelectedCategory: state.setSelectedCategory,
    setShowCustomizeModal: state.setShowCustomizeModal,
    setShowFullsizePreview: state.setShowFullsizePreview,
    setShowSortOptions: state.setShowSortOptions,
    setShowToast: state.setShowToast,
    setSortOption: state.setSortOption,
    setToastMessage: state.setToastMessage,
    setToastTemplateData: state.setToastTemplateData,
    setViewMode: state.setViewMode,
    userHabitCount: data.userHabitCount,
  });

  const viewNav = useViewNavigation();
  const packConfirm = usePackConfirm({
    allTemplates: data.allTemplates,
    importTemplate: data.importTemplate,
    onComplete: (count) => {
      state.setToastMessage(`${count} habits imported`);
      state.setShowToast(true);
    },
    setImportedIds: state.setImportedTemplateIds,
  });
  const mainBrowseData = useMainBrowseData({
    allTemplates: data.allTemplates,
    isPremiumUser: data.isPremiumUser,
    userHabitCount: data.userHabitCount,
  });

  const getCategoryLabel = (categoryId: string) =>
    data.categories?.find((c) => c.id === categoryId)?.label || categoryId;

  const handleTabPress = (tab: BrowseTab) => {
    state.setBrowseTab(tab);
    tabIndicator.setTabPosition(tab === 'categories' ? 0 : 1);
  };

  return {
    animations,
    data,
    filteredTemplates,
    getCategoryLabel,
    handlers,
    handleTabPress,
    mainBrowseData,
    packConfirm,
    scienceCountsByCategory,
    state,
    tabIndicator,
    templatesByCategory,
    viewNav,
  };
}
