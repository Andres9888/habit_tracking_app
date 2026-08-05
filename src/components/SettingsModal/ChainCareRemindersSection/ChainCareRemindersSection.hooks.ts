/** ChainCareRemindersSection hooks — time picker state + expand animations */
import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Platform } from 'react-native';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { dateToTimeString } from '../timeHelpers';

export function useStreakRemindersAnimations(
  enabled: boolean,
  showTimePicker: boolean
) {
  const reduceMotion = useReduceMotion();
  const [insetHeight, setInsetHeight] = useState(0);
  const [insetMeasured, setInsetMeasured] = useState(false);
  const [pickerHeight, setPickerHeight] = useState(0);
  const [pickerMeasured, setPickerMeasured] = useState(false);
  const [hintHeight, setHintHeight] = useState(0);
  const [hintMeasured, setHintMeasured] = useState(false);

  const insetExpand = useExpandAnimation({
    contentHeight: insetHeight,
    defaultExpanded: enabled,
    hasContentMeasured: insetMeasured,
    reduceMotion,
  });

  const pickerExpand = useExpandAnimation({
    contentHeight: pickerHeight,
    defaultExpanded: showTimePicker && Platform.OS === 'ios',
    hasContentMeasured: pickerMeasured,
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

  const handlePickerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (pickerMeasured && !showTimePicker) return;
      setPickerHeight((prev) => (prev === height ? prev : height));
      setPickerMeasured(true);
    },
    [pickerMeasured, showTimePicker]
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
      if (Platform.OS === 'android') setShowTimePicker(false);
      if (selectedDate) void onChangeTime(dateToTimeString(selectedDate));
    };

  return {
    handleHintLayout,
    handleInsetLayout,
    handlePickerLayout,
    handleTimeChange,
    hintExpand,
    insetExpand,
    pickerExpand,
  };
}

export function useTimePickerState() {
  const [showTimePicker, setShowTimePicker] = useState(false);
  return { setShowTimePicker, showTimePicker };
}
