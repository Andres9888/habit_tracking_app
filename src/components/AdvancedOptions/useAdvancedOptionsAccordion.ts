/** useAdvancedOptionsAccordion - measured expand/collapse for the Advanced Options card */

import { useState, useCallback } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';

interface UseAdvancedOptionsAccordionProps {
  isExpanded: boolean;
}

export function useAdvancedOptionsAccordion({
  isExpanded,
}: UseAdvancedOptionsAccordionProps) {
  const reduceMotion = useReduceMotion();
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);

  const { chevronAnimatedStyle, contentAnimatedStyle } = useExpandAnimation({
    contentHeight,
    defaultExpanded: isExpanded,
    hasContentMeasured,
    motion: 'timing',
    reduceMotion,
  });

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      // Only trust the measurement while expanded. Measuring during the
      // collapsed state locks in a clipped/short height (the body sits inside
      // a height:0 overflow:hidden container), which then caps the expanded
      // panel and makes the lower rows unreachable. Deferring the measure lets
      // useExpandAnimation's `auto` fallback render the true full height on the
      // first expand, which we then capture here.
      if (height <= 0 || !isExpanded) return;
      setContentHeight((prev) => (prev === height ? prev : height));
      setHasContentMeasured(true);
    },
    [isExpanded]
  );

  return {
    chevronAnimatedStyle,
    contentAnimatedStyle,
    handleContentLayout,
    reduceMotion,
  };
}
