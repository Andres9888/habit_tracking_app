/**
 * View navigation state machine for Templates screen
 *
 * Manages transitions between: main | seeAll | category | search
 * Uses Reanimated shared values for 280ms slide animations.
 */

import { useCallback, useState } from 'react';
import {
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const SLIDE_CONFIG = { duration: 280, easing: Easing.out(Easing.cubic) };

export type TemplateViewState =
  | { type: 'main' }
  | { type: 'seeAll' }
  | { type: 'starters' }
  | { type: 'categories' }
  | { type: 'category'; categoryId: string }
  | { type: 'goal'; goalId: string }
  | { type: 'search' };

export function useViewNavigation() {
  const [activeView, setActiveView] = useState<TemplateViewState>({
    type: 'main',
  });
  const slideProgress = useSharedValue(0);

  const animateIn = useCallback(() => {
    slideProgress.value = 1;
    slideProgress.value = withTiming(0, SLIDE_CONFIG);
  }, [slideProgress]);

  const animateOut = useCallback(
    (onComplete: () => void) => {
      slideProgress.value = withTiming(1, SLIDE_CONFIG);
      setTimeout(onComplete, 280);
    },
    [slideProgress]
  );

  const openSeeAll = useCallback(() => {
    setActiveView({ type: 'seeAll' });
    animateIn();
  }, [animateIn]);

  const openStarters = useCallback(() => {
    setActiveView({ type: 'starters' });
    animateIn();
  }, [animateIn]);

  const openCategories = useCallback(() => {
    setActiveView({ type: 'categories' });
    animateIn();
  }, [animateIn]);

  const openCategory = useCallback(
    (categoryId: string) => {
      setActiveView({ type: 'category', categoryId });
      animateIn();
    },
    [animateIn]
  );

  const openGoal = useCallback(
    (goalId: string) => {
      setActiveView({ type: 'goal', goalId });
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
    openGoal,
    openSearch,
    openCategories,
    openSeeAll,
    openStarters,
    slideProgress,
  };
}
