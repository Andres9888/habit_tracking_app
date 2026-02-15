
import { useEffect } from 'react';

import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CHIP_STAGGER, ENTRANCE_DELAYS, SPRING_CONFIGS } from '../animations';
import { useChipPressHandlers } from './useChipPressHandlers';

interface UseChipAnimationsParams {
  isSelected: boolean;
  staggerDelay: number;
}

export function useChipAnimations({
  isSelected,
  staggerDelay,
}: UseChipAnimationsParams) {
  const shouldReduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);

  const entranceOpacity = useSharedValue(shouldReduceMotion ? 1 : 0);
  const entranceTranslateY = useSharedValue(
    shouldReduceMotion ? 0 : CHIP_STAGGER.translateY
  );

  const totalEntranceDelay = ENTRANCE_DELAYS.chips + staggerDelay;

  useEffect(() => {
    if (shouldReduceMotion) {
      entranceOpacity.value = 1;
      entranceTranslateY.value = 0;
      return;
    }

    entranceOpacity.value = withDelay(
      totalEntranceDelay,
      withTiming(1, {
        duration: CHIP_STAGGER.duration,
        easing: Easing.out(Easing.ease),
      })
    );

    entranceTranslateY.value = withDelay(
      totalEntranceDelay,
      withTiming(0, {
        duration: CHIP_STAGGER.duration,
        easing: Easing.out(Easing.ease),
      })
    );
  }, [
    entranceOpacity,
    entranceTranslateY,
    shouldReduceMotion,
    totalEntranceDelay,
  ]);

  useEffect(() => {
    if (isSelected) {
      selectionProgress.value = shouldReduceMotion
        ? 1
        : withSpring(1, SPRING_CONFIGS.chipPress);
    } else {
      selectionProgress.value = 0;
    }
  }, [isSelected, selectionProgress, shouldReduceMotion]);

  const pressHandlers = useChipPressHandlers({
    scale,
    shadowOpacity,
    shouldReduceMotion,
    translateY,
  });

  return {
    entranceOpacity,
    entranceTranslateY,
    scale,
    selectionProgress,
    shadowOpacity,
    translateY,
    ...pressHandlers,
  };
}
