/** StreakRemindersSection hooks — time picker state + expand animations */
import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { dateToTimeString } from '../timeHelpers';

export function useStreakRemindersAnimations(
  enabled: boolean
) {
  const reduceMotion = useReduceMotion();
  const [insetHeight, setInsetHeight] = useState(0);
  const [insetMeasured, setInsetMeasured] = useState(false);
  const [hintHeight, setHintHeight] = useState(0);
  const [hintMeasured, setHintMeasured] = useState(false);

  const insetExpand = useExpandAnimation({
    contentHeight: insetHeight,
    defaultExpanded: enabled,
    hasContentMeasured: insetMeasured,
    reduceMotion,
  });

  const hintExpand = useExpandAnimation({
    contentHeight: hintHeight,
    defaultExpanded: !enabled,
    hasContentMeasured: hintMeasured,
    reduceMotion,
  });

  const handleInsetLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (insetMeasured && !enabled) return;
      setInsetHeight((prev) => (prev === height ? prev : height));
      setInsetMeasured(true);
    },
    [enabled, insetMeasured]
  );

  const handleHintLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (hintMeasured && enabled) return;
      setHintHeight((prev) => (prev === height ? prev : height));
      setHintMeasured(true);
    },
    [enabled, hintMeasured]
  );

  const handleTimeChange =
    (
      onChangeTime: (time: string) => void | Promise<void>,
      setShowTimePicker: (v: boolean) => void
    ) =>
    (_event: unknown, selectedDate?: Date) => {
      setShowTimePicker(false);
      if (selectedDate) void onChangeTime(dateToTimeString(selectedDate));
    };

  return {
    handleHintLayout,
    handleInsetLayout,
    handleTimeChange,
    hintExpand,
    insetExpand,
  };
}

export function useTimePickerState() {
  const [showTimePicker, setShowTimePicker] = useState(false);
  return { setShowTimePicker, showTimePicker };
}
