/**
 * RankEmojiTile — LoL-style metallic rank tile that holds an emoji.
 * Background, glow, and shimmer derive from strength tier (bronze → diamond).
 * Threshold crossings cross-fade over 400ms; within-tier changes don't animate.
 * `size` prop configures edge length; all internals scale from it.
 */

import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { getRankTier } from '../rankTier';
import {
  DEFAULT_TILE_SIZE,
  getSizeVars,
} from './RankEmojiTile.styles';
import type { RankEmojiTileProps } from './RankEmojiTile.types';
import { RankEmojiTileView } from './RankEmojiTileView';

const TRANSITION_MS = 360;
// Material-style symmetric bezier — softer perceived fade than Easing.out(cubic),
// matched to the mini-emoji curve so the two land as one event.
const TRANSITION_EASING = Easing.bezier(0.4, 0, 0.2, 1);

function RankEmojiTileInner({
  icon,
  strength,
  size = DEFAULT_TILE_SIZE,
}: RankEmojiTileProps) {
  const reducedMotion = useReducedMotion();
  const v = useMemo(() => getSizeVars(size), [size]);
  const nextTier = useMemo(() => getRankTier(strength), [strength]);
  const [{ from, to }, setTiers] = useState(() => ({
    from: nextTier,
    to: nextTier,
  }));
  const progress = useSharedValue(1);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (nextTier.name === to.name) return;
    setTiers({ from: to, to: nextTier });
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: reducedMotion ? 0 : TRANSITION_MS,
      easing: TRANSITION_EASING,
    });
  }, [nextTier, to, progress, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || to.shimmerSpeed === 0) {
      cancelAnimation(shimmer);
      shimmer.value = 0;
      return;
    }
    shimmer.value = withRepeat(
      withTiming(1, { duration: to.shimmerSpeed, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(shimmer);
  }, [to, shimmer, reducedMotion]);

  const toStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmer.value, [0, 1], [-v.shimmerWidth, v.size + v.shimmerWidth / 2]),
      },
      { rotate: '18deg' },
    ],
  }));

  return (
    <RankEmojiTileView
      from={from}
      icon={icon}
      shimmerStyle={shimmerStyle}
      to={to}
      toStyle={toStyle}
      vars={v}
    />
  );
}

export const RankEmojiTile = memo(RankEmojiTileInner);
