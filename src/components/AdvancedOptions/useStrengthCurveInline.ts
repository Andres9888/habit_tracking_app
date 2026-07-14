/** State + animation for the inline Strength Curve trigger/expand. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, type LayoutChangeEvent } from 'react-native';
import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import type { GrowthType } from '@/utils/growthTypeMeta';
import { CURVE_MOCK_COPY, GROWTH_TO_MODE } from './mockTokens';

interface Args {
  strengthAlgorithm: AlgorithmMode;
  growthType: GrowthType | undefined;
  onSelect: (mode: AlgorithmMode) => void;
}

export function useStrengthCurveInline({
  strengthAlgorithm,
  growthType,
  onSelect,
}: Args) {
  const reduceMotion = useReduceMotion();
  const [open, setOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);
  const { chevronAnimatedStyle, contentAnimatedStyle } = useExpandAnimation({
    contentHeight,
    defaultExpanded: open,
    hasContentMeasured,
    motion: 'spring',
    reduceMotion,
  });

  const suggested = growthType ? GROWTH_TO_MODE[growthType] : 'strict';
  const [userOverrode, setUserOverrode] = useState(
    () => strengthAlgorithm !== suggested
  );
  const prevGrowthTypeRef = useRef(growthType);

  // Re-suggest logic (contract §4 row 3): follow the new suggestion only if
  // the user never manually overrode the curve; otherwise keep the selection
  // and let the "Suggested" pill move to the new detected type.
  useEffect(() => {
    if (prevGrowthTypeRef.current === growthType) return;
    prevGrowthTypeRef.current = growthType;
    if (!userOverrode) onSelect(suggested);
  }, [growthType, suggested, userOverrode, onSelect]);

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (hasContentMeasured && !open) return;
      setContentHeight((prev) => (prev === height ? prev : height));
      setHasContentMeasured(true);
    },
    [hasContentMeasured, open]
  );

  const handleSelect = (mode: AlgorithmMode) => {
    setUserOverrode(mode !== suggested);
    onSelect(mode);
    const c = CURVE_MOCK_COPY[mode];
    AccessibilityInfo.announceForAccessibility(
      `Strength curve, ${c.name}, +${c.growthPct}% per check-in`
    );
  };

  return {
    open,
    setOpen,
    chevronAnimatedStyle,
    contentAnimatedStyle,
    handleContentLayout,
    suggested,
    handleSelect,
  };
}
