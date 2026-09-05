/**
 * useStreakAccordionState - State management for StreakRecordsAccordion
 */

import { useState, useCallback, useMemo } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { usePulseAnimation } from './usePulseAnimation';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { MEDALS } from './constants';
import type { StreakRecord } from '../types';

interface UseStreakAccordionStateArgs {
  streakRecords: StreakRecord[];
  currentStreak: number;
  defaultExpanded: boolean;
}

export function useStreakAccordionState({
  streakRecords,
  currentStreak,
  defaultExpanded,
}: UseStreakAccordionStateArgs) {
  const reduceMotion = useReducedMotion();
  const { triggerSelection } = useHapticFeedback();

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);

  const pulseAnimatedStyle = usePulseAnimation({ currentStreak, reduceMotion });
  const { chevronAnimatedStyle, contentAnimatedStyle } = useExpandAnimation({
    contentHeight,
    defaultExpanded: isExpanded,
    hasContentMeasured,
    reduceMotion,
  });

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (hasContentMeasured && !isExpanded) return;
      setContentHeight((prev) => (prev === height ? prev : height));
      setHasContentMeasured(true);
    },
    [hasContentMeasured, isExpanded]
  );

  const handleToggle = useCallback(() => {
    triggerSelection();
    setIsExpanded((prev) => !prev);
  }, [triggerSelection]);

  const top3Records = useMemo(() => streakRecords.slice(0, 3), [streakRecords]);
  const hasRecords = top3Records.length > 0;
  const previewText = useMemo(
    () => top3Records.map((r, i) => `${MEDALS[i]}${r.days}`).join(' '),
    [top3Records]
  );

  const accessibilityLabel = useMemo(
    () =>
      hasRecords
        ? `Streak records. ${top3Records.map((r, i) => `${['Gold', 'Silver', 'Bronze'][i]}: ${r.days} days${r.isCurrent ? ', current streak' : ''}`).join(', ')}. ${isExpanded ? 'Expanded' : 'Collapsed'}.`
        : 'No streak records yet.',
    [hasRecords, top3Records, isExpanded]
  );

  return {
    accessibilityLabel,
    chevronAnimatedStyle,
    contentAnimatedStyle,
    handleContentLayout,
    handleToggle,
    hasContentMeasured,
    hasRecords,
    isExpanded,
    previewText,
    pulseAnimatedStyle,
    reduceMotion,
    top3Records,
  };
}
