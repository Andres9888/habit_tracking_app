/**
 * RankEmojiTile — LoL-style metallic rank tile that holds an emoji.
 * Background, glow, and shimmer derive from strength tier (bronze → diamond).
 * Threshold crossings cross-fade over 400ms; within-tier changes don't animate.
 * `size` prop configures edge length; all internals scale from it.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { getRankTier, type RankTier } from '../rankTier';
import {
  DEFAULT_TILE_SIZE,
  baseStyles,
  getSizeVars,
} from './RankEmojiTile.styles';
import type { RankEmojiTileProps } from './RankEmojiTile.types';

const TRANSITION_MS = 400;

const glow = (t: RankTier, scale: number) =>
  Platform.OS === 'android'
    ? { elevation: Math.max(1, Math.round((t.glowRadius * scale) / 2)) }
    : {
        shadowColor: t.glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: t.glowOpacity,
        shadowRadius: t.glowRadius * scale,
      };

const Gradient = ({ tier, radius }: { tier: RankTier; radius: number }) => (
  <LinearGradient
    colors={tier.gradient as unknown as [string, string]}
    end={{ x: 1, y: 1 }}
    start={{ x: 0, y: 0 }}
    style={[baseStyles.gradientLayer, { borderRadius: radius }]}
  />
);

export function RankEmojiTile({
  icon,
  strength,
  size = DEFAULT_TILE_SIZE,
}: RankEmojiTileProps) {
  const reducedMotion = useReducedMotion();
  const v = getSizeVars(size);
  const [{ from, to }, setTiers] = useState(() => {
    const t = getRankTier(strength);
    return { from: t, to: t };
  });
  const progress = useSharedValue(1);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    const next = getRankTier(strength);
    if (next.name === to.name) return;
    setTiers({ from: to, to: next });
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: reducedMotion ? 0 : TRANSITION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [strength, to, progress, reducedMotion]);

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
    <View style={[{ width: v.size, height: v.size }, glow(to, v.glowScale)]}>
      <View
        style={[
          baseStyles.tile,
          { width: v.size, height: v.size, borderRadius: v.radius },
        ]}
      >
        <Gradient tier={from} radius={v.radius} />
        <Animated.View style={[baseStyles.gradientLayer, { borderRadius: v.radius }, toStyle]}>
          <Gradient tier={to} radius={v.radius} />
        </Animated.View>
        <View
          pointerEvents='none'
          style={[
            baseStyles.highlight,
            {
              backgroundColor: to.highlight,
              height: v.highlightHeight,
              top: v.highlightTop,
              borderRadius: v.radius - 2,
            },
          ]}
        />
        {to.shimmerSpeed > 0 ? (
          <Animated.View
            pointerEvents='none'
            style={[
              baseStyles.shimmer,
              {
                width: v.shimmerWidth,
                height: v.size * 1.4,
                top: -v.size * 0.2,
                borderRadius: v.radius,
              },
              shimmerStyle,
            ]}
          />
        ) : null}
        <Text
          allowFontScaling={false}
          style={[
            baseStyles.emoji,
            { fontSize: v.emojiFontSize, lineHeight: v.emojiLineHeight },
          ]}
        >
          {icon}
        </Text>
      </View>
    </View>
  );
}
