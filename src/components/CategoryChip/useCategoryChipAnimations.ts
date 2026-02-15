/**
 * CategoryChip Animation Hook
 */

import { useEffect } from 'react';

import {
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { CATEGORY_COLORS } from './CategoryChip.constants';
import { useAnimatedStyles } from './useAnimatedStyles';

interface UseCategoryChipAnimationsParams {
  id: string;
  isSelected: boolean;
  animationIndex: number;
}

export function useCategoryChipAnimations({
  id,
  isSelected,
  animationIndex,
}: UseCategoryChipAnimationsParams) {
  const colors = CATEGORY_COLORS[id] || CATEGORY_COLORS.all;

  const chipOpacity = useSharedValue(0);
  const chipTranslateX = useSharedValue(-20);
  const pressScale = useSharedValue(1);
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);

  // Entrance animation
  useEffect(() => {
    const delay = animationIndex * 50;
    chipOpacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
    );
    chipTranslateX.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 150 })
    );
  }, [animationIndex, chipOpacity, chipTranslateX]);

  // Selection animation
  useEffect(() => {
    selectionProgress.value = withSpring(isSelected ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected, selectionProgress]);

  const animatedStyles = useAnimatedStyles({
    chipOpacity,
    chipTranslateX,
    pressScale,
    primaryColor: colors.primary,
    selectionProgress,
  });

  return {
    ...animatedStyles,
    colors,
    pressScale,
  };
}
