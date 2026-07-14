/** Shared measured-expand hook for pop-mounted inline bodies (Streak Custom, Growth Custom/More themes). */
import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export function useInlineExpand(open: boolean) {
  const reduceMotion = useReduceMotion();
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);
  const { contentAnimatedStyle } = useExpandAnimation({
    contentHeight,
    defaultExpanded: open,
    hasContentMeasured,
    motion: 'spring',
    reduceMotion,
  });

  const onContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (hasContentMeasured && !open) return;
      setContentHeight((prev) => (prev === height ? prev : height));
      setHasContentMeasured(true);
    },
    [hasContentMeasured, open]
  );

  return { contentAnimatedStyle, onContentLayout };
}
