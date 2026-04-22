import { useEffect, useState } from 'react';
import {
  Easing,
  type SharedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  getMaterialTier,
  type MaterialTier,
} from '../components/HabitChainVisualizer/materialTier';

export interface AnimatedTier {
  /** 0 during a tier change, 1 when settled. Animates via withTiming. */
  progress: SharedValue<number>;
  /** Tier the transition is coming from. Equal to `to` when settled. */
  from: MaterialTier;
  /** Current / target tier. */
  to: MaterialTier;
}

const TRANSITION_DURATION = 400;

/**
 * Drive a 0→1 progress value when `strengthPercent` crosses a tier threshold.
 * Consumers interpolate colors/sizes between `from` and `to` in their own
 * worklets using `interpolateColor` / `interpolate`.
 *
 * Within-tier `strengthPercent` changes (e.g. 25 → 30) do NOT animate.
 */
export function useAnimatedTier(strengthPercent: number): AnimatedTier {
  const [tiers, setTiers] = useState(() => {
    const initial = getMaterialTier(strengthPercent);
    return { from: initial, to: initial };
  });
  const progress = useSharedValue(1);

  useEffect(() => {
    const next = getMaterialTier(strengthPercent);
    if (next.name === tiers.to.name) return;
    setTiers({ from: tiers.to, to: next });
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: TRANSITION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [strengthPercent, tiers.to, progress]);

  return { progress, from: tiers.from, to: tiers.to };
}

/** Pick the rendered color for a tier, honoring `useAccent`. Worklet-safe. */
export function resolveTierColor(
  tier: MaterialTier,
  accentColor: string
): string {
  'worklet';
  return tier.useAccent ? accentColor : tier.tierColor;
}

/** Pick the glow/shadow color for a tier, honoring `useAccent`. */
export function resolveTierShadowColor(
  tier: MaterialTier,
  accentColor: string
): string {
  'worklet';
  if (tier.cellShadowColor) return tier.cellShadowColor;
  return accentColor;
}
