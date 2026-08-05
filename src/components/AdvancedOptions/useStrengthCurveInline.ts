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
  /** New-habit flows follow the detected suggestion; edit flows respect the saved value. */
  isNewHabit: boolean;
  onSelect: (mode: AlgorithmMode) => void;
}

export function useStrengthCurveInline({
  strengthAlgorithm,
  growthType,
  isNewHabit,
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
  // New habit: the form value is an untouched default — never infer an override
  // from divergence. Edit: a saved value diverging from a live detection means
  // the user chose it earlier; respect it.
  const [userOverrode, setUserOverrode] = useState(
    () =>
      !isNewHabit && growthType !== undefined && strengthAlgorithm !== suggested
  );
  const prevGrowthTypeRef = useRef(growthType);

  // Default-from-habit-type (contract §1) + re-suggest (contract §4 row 3).
  // New habits: apply the suggestion whenever detection is live and the user
  // hasn't overridden — covers mount-with-detection AND detection-after-mount.
  // Existing habits: only follow when growthType actually CHANGES.
  useEffect(() => {
    const growthTypeChanged = prevGrowthTypeRef.current !== growthType;
    prevGrowthTypeRef.current = growthType;
    if (userOverrode || growthType === undefined) return;
    if ((isNewHabit || growthTypeChanged) && strengthAlgorithm !== suggested) {
      onSelect(suggested);
    }
  }, [
    growthType,
    suggested,
    userOverrode,
    isNewHabit,
    strengthAlgorithm,
    onSelect,
  ]);

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
    reduceMotion,
    chevronAnimatedStyle,
    contentAnimatedStyle,
    handleContentLayout,
    suggested,
    handleSelect,
  };
}
