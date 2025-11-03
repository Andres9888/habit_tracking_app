import { useCallback } from 'react';
import type { ScrollView } from 'react-native';
import type { HabitTemplate } from '../types';

interface UseTemplateBrowserHandlersOptions {
  isEditMode: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setIsVisible: (value: boolean) => void;
  setHasScrolledPastHero: (value: boolean) => void;
  animateOpen: () => void;
  animateClose: (onFinished?: () => void) => void;
  scrollViewRef: React.RefObject<ScrollView | null>;
  onTemplateSelect: (template: HabitTemplate) => void;
}

export const useTemplateBrowserHandlers = ({
  isEditMode,
  isOpen,
  setIsOpen,
  setIsVisible,
  setHasScrolledPastHero,
  animateOpen,
  animateClose,
  scrollViewRef,
  onTemplateSelect,
}: UseTemplateBrowserHandlersOptions) => {
  const openBrowser = useCallback(() => {
    setIsOpen(true);
    setIsVisible(true);
    setHasScrolledPastHero(false);
    animateOpen();
  }, [animateOpen, setHasScrolledPastHero, setIsOpen, setIsVisible]);

  const closeBrowser = useCallback(() => {
    animateClose(() => setIsVisible(false));
    setIsOpen(false);
  }, [animateClose, setIsOpen, setIsVisible]);

  const handleHeroPress = useCallback(() => {
    if (isOpen) return closeBrowser();
    openBrowser();
    requestAnimationFrame(() =>
      scrollViewRef.current?.scrollTo({ animated: true, y: 0 })
    );
  }, [closeBrowser, isOpen, openBrowser, scrollViewRef]);

  const handleMainScroll = useCallback(
    (event: any) => {
      if (isEditMode || isOpen) return;
      const next = event.nativeEvent.contentOffset.y > 120;
      setHasScrolledPastHero(next);
    },
    [isEditMode, isOpen, setHasScrolledPastHero]
  );

  const handleReminderPress = useCallback(() => {
    if (isOpen) return;
    scrollViewRef.current?.scrollTo({ animated: true, y: 0 });
    setTimeout(openBrowser, 160);
  }, [isOpen, openBrowser, scrollViewRef]);

  const handleTemplateSelect = useCallback(
    (template: HabitTemplate) => {
      onTemplateSelect(template);
      closeBrowser();
    },
    [closeBrowser, onTemplateSelect]
  );

  const resetVisibility = useCallback(() => {
    setIsOpen(false);
    setIsVisible(false);
    setHasScrolledPastHero(false);
  }, [setHasScrolledPastHero, setIsOpen, setIsVisible]);

  return {
    openBrowser,
    closeBrowser,
    handleHeroPress,
    handleMainScroll,
    handleReminderPress,
    handleTemplateSelect,
    resetVisibility,
  };
};
