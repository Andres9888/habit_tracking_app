/**
 * View navigation state machine for Templates screen
 *
 * Manages transitions between: main | seeAll | category | search
 * Uses Reanimated shared values for 280ms slide animations.
 */

import { useCallback, useState } from 'react';
import {
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '../../../theme/animations';

export type TemplateViewState =
  | { type: 'main' }
  | { type: 'seeAll' }
  | { type: 'category'; categoryId: string }
  | { type: 'search' };

export function useViewNavigation() {
  const [activeView, setActiveView] = useState<TemplateViewState>({
    type: 'main',
  });
  const slideProgress = useSharedValue(0);

  const animateIn = useCallback(() => {
    slideProgress.value = 1;
    slideProgress.value = withSpring(0, springs.bottomSheet);
  }, [slideProgress]);

  const animateOut = useCallback(
    (onComplete: () => void) => {
      slideProgress.value = withSpring(1, springs.exit);
      // Allow animation to complete before state change
      setTimeout(onComplete, 280);
    },
    [slideProgress]
  );

  const openSeeAll = useCallback(() => {
    setActiveView({ type: 'seeAll' });
    animateIn();
  }, [animateIn]);

  const openCategory = useCallback(
    (categoryId: string) => {
      setActiveView({ type: 'category', categoryId });
      animateIn();
    },
    [animateIn]
  );

  const openSearch = useCallback(() => {
    setActiveView({ type: 'search' });
  }, []);

  const goBack = useCallback(() => {
    animateOut(() => setActiveView({ type: 'main' }));
  }, [animateOut]);

  const closeSearch = useCallback(() => {
    setActiveView({ type: 'main' });
  }, []);

  return {
    activeView,
    closeSearch,
    goBack,
    openCategory,
    openSearch,
    openSeeAll,
    slideProgress,
  };
}
