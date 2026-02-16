/**
 * useStreakAccordionState - State management for StreakRecordsAccordion
 */

import { useState, useCallback, useMemo } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { useHapticFeedback } from '../../../hooks/useHapticFeedback';
import { usePulseAnimation } from './usePulseAnimation';
import { useExpandAnimation } from './useExpandAnimation';
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
  const reduceMotion = useReduceMotion();
  const { triggerSelection } = useHapticFeedback();

  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);

  const pulseAnimatedStyle = usePulseAnimation({ currentStreak, reduceMotion });
  const { animateToggle, contentAnimatedStyle, chevronAnimatedStyle } =
    useExpandAnimation({
      contentHeight,
      defaultExpanded,
      hasContentMeasured,
      reduceMotion,
    });

  const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setContentHeight(height);
      setHasContentMeasured(true);
    }
  }, []);

  const handleToggle = useCallback(() => {
    triggerSelection();
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    animateToggle(newExpanded);
  }, [isExpanded, triggerSelection, animateToggle]);

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
