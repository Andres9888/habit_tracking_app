/**
 * useOnboardingHandlers — navigation and completion handlers for onboarding.
 */

import { useCallback, useRef, useState } from 'react';
import { FlatList, type ViewToken } from 'react-native';
import { safeSetBoolean } from '@/utils/storage';
import { ONBOARDING_KEY, PAGES } from './onboarding.data';
import { triggerHaptic } from '@/utils/haptics';

export function useOnboardingHandlers(onComplete: () => void) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleComplete = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    void triggerHaptic('toggle');
    try {
      await safeSetBoolean(ONBOARDING_KEY, true);
      onComplete();
    } catch (error) {
      if (__DEV__) console.error('[OnboardingScreen] Failed to save completion state:', error);
      onComplete();
    } finally {
      setIsLoading(false);
    }
  }, [onComplete, isLoading]);

  const handleSkip = useCallback(() => {
    void triggerHaptic('tap');
    void handleComplete();
  }, [handleComplete]);

  const handleNext = useCallback(() => {
    void triggerHaptic('tap');
    if (currentIndex < PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: currentIndex + 1,
      });
    }
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return {
    currentIndex,
    flatListRef,
    handleComplete,
    handleNext,
    handleSkip,
    isLastPage: currentIndex === PAGES.length - 1,
    isLoading,
    onViewableItemsChanged,
    viewabilityConfig,
  };
}
