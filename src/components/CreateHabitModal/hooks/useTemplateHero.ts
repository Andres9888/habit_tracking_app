import { useCallback, useState } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';

interface UseTemplateHeroOptions {
  isEditMode: boolean;
  isOpen: boolean;
  scrollViewRef: React.RefObject<ScrollView | null>;
  openBrowser: () => void;
  closeBrowser: () => void;
}

export const useTemplateHero = ({
  isEditMode,
  isOpen,
  scrollViewRef,
  openBrowser,
  closeBrowser,
}: UseTemplateHeroOptions) => {
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);

  const handleHeroPress = useCallback(() => {
    if (isOpen) return closeBrowser();
    openBrowser();
    requestAnimationFrame(() =>
      scrollViewRef.current?.scrollTo({ animated: true, y: 0 })
    );
  }, [closeBrowser, isOpen, openBrowser, scrollViewRef]);

  const handleMainScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isEditMode || isOpen) return;
      const offsetY = event.nativeEvent.contentOffset.y;
      setHasScrolledPastHero((prev) => {
        const next = offsetY > 120;
        return prev === next ? prev : next;
      });
    },
    [isEditMode, isOpen]
  );

  const handleReminderPress = useCallback(() => {
    if (isOpen) return;
    scrollViewRef.current?.scrollTo({ animated: true, y: 0 });
    setTimeout(openBrowser, 160);
  }, [isOpen, openBrowser, scrollViewRef]);

  return {
    hasScrolledPastHero,
    setHasScrolledPastHero,
    handleHeroPress,
    handleMainScroll,
    handleReminderPress,
  };
};
