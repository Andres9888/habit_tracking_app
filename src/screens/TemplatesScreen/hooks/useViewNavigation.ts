/**
 * View navigation for Templates screen — wraps useViewStack with animation
 */

import { useCallback } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import { useViewStack } from './useViewStack';

const SLIDE_CONFIG = { duration: 280, easing: Easing.out(Easing.cubic) };

export type DetailSourcePath =
  | 'goal' | 'category' | 'search'
  | 'guide' | 'trending' | 'starter' | 'pairing';

export type TemplateViewState =
  | { type: 'main' }
  | { type: 'seeAll' }
  | { type: 'starters' }
  | { type: 'categories' }
  | { type: 'category'; categoryId: string }
  | { type: 'goal'; goalId: string }
  | { type: 'search' }
  | { type: 'detail'; templateId: string; sourcePath: DetailSourcePath }
  | { type: 'guidedPicker' };

export function useViewNavigation() {
  const viewStack = useViewStack();
  const slideProgress = useSharedValue(0);

  const animateIn = useCallback(() => {
    slideProgress.value = 1;
    slideProgress.value = withTiming(0, SLIDE_CONFIG);
  }, [slideProgress]);

  const pushWithAnim = useCallback(
    (view: TemplateViewState) => { viewStack.push(view); animateIn(); },
    [viewStack, animateIn]
  );

  const goBack = useCallback(() => {
    slideProgress.value = withTiming(1, SLIDE_CONFIG);
    setTimeout(() => viewStack.pop(), 280);
  }, [slideProgress, viewStack]);

  return {
    activeView: viewStack.current,
    canGoBack: viewStack.canGoBack,
    closeSearch: () => viewStack.pop(),
    goBack,
    openCategory: (id: string) => pushWithAnim({ type: 'category', categoryId: id }),
    openCategories: () => pushWithAnim({ type: 'categories' }),
    openDetail: (templateId: string, sourcePath: DetailSourcePath) =>
      pushWithAnim({ type: 'detail', templateId, sourcePath }),
    openGoal: (id: string) => pushWithAnim({ type: 'goal', goalId: id }),
    openGuidedPicker: () => pushWithAnim({ type: 'guidedPicker' }),
    openSearch: () => viewStack.push({ type: 'search' }),
    openSeeAll: () => pushWithAnim({ type: 'seeAll' }),
    openStarters: () => pushWithAnim({ type: 'starters' }),
    resetToMain: () => viewStack.reset(),
    slideProgress,
  };
}
