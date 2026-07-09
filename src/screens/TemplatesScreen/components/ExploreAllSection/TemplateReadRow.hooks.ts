/** Expand state + measured-height wiring for TemplateReadRow's science drawer */

import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';

export function useTemplateReadRow() {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);
  const reduceMotion = useReduceMotion();

  const { chevronAnimatedStyle, contentAnimatedStyle } = useExpandAnimation({
    contentHeight,
    defaultExpanded: expanded,
    hasContentMeasured,
    motion: 'timing',
    reduceMotion,
  });

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (hasContentMeasured && !expanded) return;
      setContentHeight((prev) => (prev === height ? prev : height));
      setHasContentMeasured(true);
    },
    [expanded, hasContentMeasured]
  );

  return {
    chevronAnimatedStyle,
    contentAnimatedStyle,
    expanded,
    handleContentLayout,
    toggle: () => setExpanded((prev) => !prev),
  };
}
