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

  const { contentAnimatedStyle, chevronAnimatedStyle } = useExpandAnimation({
    contentHeight,
    defaultExpanded: isExpanded,
    hasContentMeasured,
    reduceMotion,
  });

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;

      // Lock height while collapsed so shrink-on-layout cannot fight the close animation.
      if (hasContentMeasured && !isExpanded) return;

      setContentHeight((prev) => (prev === height ? prev : height));
      setHasContentMeasured(true);
    },
    [hasContentMeasured, isExpanded]
  );

  return {
    chevronAnimatedStyle,
    contentAnimatedStyle,
    handleContentLayout,
  };
}
