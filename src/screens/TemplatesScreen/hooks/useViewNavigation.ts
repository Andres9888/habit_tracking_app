/**
 * View navigation state machine for Templates screen
 *
 * Manages transitions between: main | catalog
 * Uses Reanimated shared values for slide animations.
 */

import { useCallback, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { durations, enterEasing } from '@/theme/animations';

const SLIDE_CONFIG = { duration: durations.enter, easing: enterEasing };

export type TemplateViewState =
  | { type: 'main' }
  | { type: 'catalog'; initialCategoryId?: string };

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
      setTimeout(onComplete, SLIDE_CONFIG.duration);
    },
    [slideProgress]
  );

  const openCatalog = useCallback(
    (initialCategoryId?: string) => {
      setActiveView({ type: 'catalog', initialCategoryId });
      animateIn();
    },
    [animateIn]
  );

  const goBack = useCallback(() => {
    animateOut(() => setActiveView({ type: 'main' }));
  }, [animateOut]);

  return {
    activeView,
    goBack,
    openCatalog,
    slideProgress,
  };
}
