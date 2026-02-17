/* eslint-disable max-lines */
/**
 * ChainVisualizationBanner.hooks.ts
 * Data and animation state for the ChainVisualizationBanner.
 */

import { useMemo, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import {
  buildChainDays,
  computeCurrentStreak,
  findChainGaps,
  shouldShimmer,
  CHAIN_BANNER_DAYS,
} from './chainBannerUtils';
import { getLocalDateString } from '@/utils/getLocalDateString';

interface UseChainVisualizationBannerParams {
  completedDates: Set<string>;
  habitCreatedAt?: number;
  /** Accent color (hex) from the habit */
  accentColor: string;
  reduceMotion?: boolean;
}

export interface ChainVisualizationBannerData {
  chainDays: ReturnType<typeof buildChainDays>;
  currentStreak: number;
  gaps: Array<[number, number]>;
  hasShimmer: boolean;
  /** Animated shimmer position (0→1) for shimmer overlay */
  shimmerPosition: Animated.Value;
  /** Per-day entrance animation values (scale + opacity) */
  linkAnims: Animated.CompositeAnimation | null;
  linkScales: Animated.Value[];
  linkOpacities: Animated.Value[];
}

export function useChainVisualizationBanner({
  completedDates,
  habitCreatedAt,
  reduceMotion = false,
}: UseChainVisualizationBannerParams): ChainVisualizationBannerData {
  const todayString = useMemo(() => getLocalDateString(), []);

  const chainDays = useMemo(
    () => buildChainDays(completedDates, habitCreatedAt, todayString, CHAIN_BANNER_DAYS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [completedDates, habitCreatedAt, todayString],
  );

  const currentStreak = useMemo(() => computeCurrentStreak(chainDays), [chainDays]);
  const gaps = useMemo(() => findChainGaps(chainDays), [chainDays]);
  const hasShimmer = useMemo(() => shouldShimmer(currentStreak) && !reduceMotion, [currentStreak, reduceMotion]);

  // Shimmer loop animation
  const shimmerPosition = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!hasShimmer) {
      shimmerPosition.setValue(0);
      return;
    }
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerPosition, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerPosition, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasShimmer]);

  // Per-link entrance animations — staggered spring entries
  const linkScales = useRef<Animated.Value[]>(
    Array.from({ length: CHAIN_BANNER_DAYS }, () => new Animated.Value(0))
  ).current;
  const linkOpacities = useRef<Animated.Value[]>(
    Array.from({ length: CHAIN_BANNER_DAYS }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (reduceMotion) {
      for (const v of linkScales) v.setValue(1);
      for (const v of linkOpacities) v.setValue(1);
      return;
    }

    const animations = chainDays.map((_, i) =>
      Animated.parallel([
        Animated.spring(linkScales[i], {
          toValue: 1,
          damping: 18,
          stiffness: 150,
          useNativeDriver: true,
        }),
        Animated.timing(linkOpacities[i], {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const staggered = Animated.stagger(30, animations);
    staggered.start();
    return () => staggered.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  return {
    chainDays,
    currentStreak,
    gaps,
    hasShimmer,
    shimmerPosition,
    linkAnims: null,
    linkScales,
    linkOpacities,
  };
}
