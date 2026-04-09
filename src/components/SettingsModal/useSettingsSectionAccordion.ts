/** useSettingsSectionAccordion - Per-section accordion animation and measurement */

import { useState, useCallback } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';

interface UseSettingsSectionAccordionProps {
  isExpanded: boolean;
}

export function useSettingsSectionAccordion({
  isExpanded,
}: UseSettingsSectionAccordionProps) {
  const reduceMotion = useReduceMotion();
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);

  const { animateToggle, contentAnimatedStyle, chevronAnimatedStyle } =
    useExpandAnimation({
      contentHeight,
      defaultExpanded: isExpanded,
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

  return {
    animateToggle,
    chevronAnimatedStyle,
    contentAnimatedStyle,
    handleContentLayout,
  };
}
