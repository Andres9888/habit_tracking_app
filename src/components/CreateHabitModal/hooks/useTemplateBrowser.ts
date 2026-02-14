import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScrollView } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Category, CategoryFilter, HabitTemplate } from '../types';
import { useKeyboardState } from './useKeyboardState';
import { useTemplateAnimation } from './useTemplateAnimation';
import { useTemplateBrowserHandlers } from './useTemplateBrowserHandlers';
import { useTemplateScrollIndicators } from './useTemplateScrollIndicators';
import { useHabitTemplates } from './useHabitTemplates';
interface UseTemplateBrowserOptions {
  isEditMode: boolean;
  visible: boolean;
  onTemplateSelect: (template: HabitTemplate) => void;
}

export const useTemplateBrowser = ({ isEditMode, visible, onTemplateSelect }: UseTemplateBrowserOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const { isKeyboardVisible, keyboardHeight } = useKeyboardState();
  const { anim, chevronRotation, translateY, animateOpen, animateClose, resetAnimation } =
    useTemplateAnimation();
  const { showTopShadow, showBottomShadow, handleScroll, handleContentSizeChange, handleLayout, resetIndicators } =
    useTemplateScrollIndicators();
  const { filtered, isLoading } = useHabitTemplates(selectedCategory);
  const categoriesQuery = useQuery(api.categories.list, {});
  const fallbackCategories: CategoryFilter[] = [
    { icon: '✨', id: 'all', label: 'All' },
  ];
  const categories =
    (categoriesQuery as CategoryFilter[] | undefined) ?? fallbackCategories;
  const handleCategoryPress = useCallback((category: Category) => setSelectedCategory(category), []);
  const {
    openBrowser,
    closeBrowser,
    handleHeroPress,
    handleMainScroll,
    handleReminderPress,
    handleTemplateSelect,
    resetVisibility,
  } = useTemplateBrowserHandlers({
    animateClose,
    animateOpen,
    isEditMode,
    isOpen,
    onTemplateSelect,
    scrollViewRef,
    setHasScrolledPastHero,
    setIsOpen,
    setIsVisible,
  });

  useEffect(() => { resetIndicators(); }, [filtered.length, isOpen, resetIndicators]);
  useEffect(() => {
    if (visible) return;
    resetVisibility();
    resetAnimation();
    setSelectedCategory('all');
  }, [resetAnimation, resetVisibility, visible]);
  const shouldShowTemplateReminder = !isEditMode && hasScrolledPastHero && !isVisible;
  const reminderBottomOffset = isKeyboardVisible ? keyboardHeight + 24 : 24;
  const reset = useCallback(() => setSelectedCategory('all'), []);

  return {
    categories,
    chevronRotation,
    closeTemplateBrowser: closeBrowser,
    filteredTemplates: filtered,
    handleCategoryPress,
    handleHeroPress,
    handleMainScroll,
    handleReminderPress,
    handleTemplateListContentSizeChange: handleContentSizeChange,
    handleTemplateListLayout: handleLayout,
    handleTemplateListScroll: handleScroll,
    handleTemplateSelect,
    isLoadingTemplates: isLoading,
    isTemplateBrowserOpen: isOpen,
    isTemplateBrowserVisible: isVisible,
    reminderBottomOffset,
    reset,
    scrollViewRef,
    selectedCategory,
    shouldShowTemplateReminder,
    showTemplateBottomShadow: showBottomShadow,
    showTemplateTopShadow: showTopShadow,
    templateBrowserAnim: anim,
    templateBrowserTranslate: translateY,
  };
};

/** Type for the return value of useTemplateBrowser */
export type UseTemplateBrowser = ReturnType<typeof useTemplateBrowser>;
