import { useEffect, useMemo, useState } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { getRankTier } from '../rankTier';

const TRANSITION_MS = 360;
const TRANSITION_EASING = Easing.bezier(0.4, 0, 0.2, 1);

export function useRankTierTransition(strength: number) {
  const reducedMotion = useReducedMotion();
  const nextTier = useMemo(() => getRankTier(strength), [strength]);
  const [{ from, to }, setTiers] = useState(() => ({
    from: nextTier,
    to: nextTier,
  }));
  const progress = useSharedValue(1);

  useEffect(() => {
    if (nextTier.name === to.name) return;
    setTiers({ from: to, to: nextTier });
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: reducedMotion ? 0 : TRANSITION_MS,
      easing: TRANSITION_EASING,
    });
  }, [nextTier, to, progress, reducedMotion]);

  const toStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  return { from, to, toStyle };
}
