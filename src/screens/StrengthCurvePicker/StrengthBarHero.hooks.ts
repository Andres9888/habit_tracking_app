import type { AlgorithmMode } from '@/components/AlgorithmPicker';
import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { FILL_PERCENT } from './StrengthBarHero.constants';
import { durations } from '@/theme/animations';

export function useStrengthBarFill(mode: AlgorithmMode) {
  const reduceMotion = useReducedMotion();
  const fillWidth = useSharedValue(reduceMotion ? FILL_PERCENT : 0);

  useEffect(() => {
    if (reduceMotion) {
      fillWidth.value = FILL_PERCENT;
      return;
    }
    fillWidth.value = 0;
    fillWidth.value = withDelay(
      durations.reveal,
      withTiming(FILL_PERCENT, { duration: durations.complex })
    );
  }, [fillWidth, mode, reduceMotion]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fillWidth.value}%` }));

  return { fillStyle };
}
