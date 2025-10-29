import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScrollView } from 'react-native';
import { CATEGORIES } from '../constants';
import type { Category, HabitTemplate } from '../types';
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
    isEditMode,
    isOpen,
    setIsOpen,
    setIsVisible,
    setHasScrolledPastHero,
    animateOpen,
    animateClose,
    scrollViewRef,
    onTemplateSelect,
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
    scrollViewRef,
    isTemplateBrowserOpen: isOpen,
    isTemplateBrowserVisible: isVisible,
    templateBrowserAnim: anim,
    chevronRotation,
    templateBrowserTranslate: translateY,
    selectedCategory,
    handleCategoryPress,
    categories: CATEGORIES,
    isLoadingTemplates: isLoading,
    filteredTemplates: filtered,
    handleTemplateSelect,
    closeTemplateBrowser: closeBrowser,
    handleTemplateListScroll: handleScroll,
    handleTemplateListContentSizeChange: handleContentSizeChange,
    handleTemplateListLayout: handleLayout,
    showTemplateTopShadow: showTopShadow,
    showTemplateBottomShadow: showBottomShadow,
    handleHeroPress,
    handleMainScroll,
    handleReminderPress,
    shouldShowTemplateReminder,
    reminderBottomOffset,
    reset,
  };
};
