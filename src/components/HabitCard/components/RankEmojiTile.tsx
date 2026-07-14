/**
 * RankEmojiTile — LoL-style metallic rank tile that holds an emoji.
 * Background, glow, and shimmer derive from strength tier (bronze → diamond).
 * Threshold crossings cross-fade over 400ms; within-tier changes don't animate.
 * `size` prop configures edge length; all internals scale from it.
 */

import React, { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  DEFAULT_TILE_SIZE,
  baseStyles,
  getSizeVars,
} from './RankEmojiTile.styles';
import type { RankEmojiTileProps } from './RankEmojiTile.types';
import { getRankGlow, RankGradient } from './RankEmojiTileVisuals';
import { useRankShimmer } from './useRankShimmer';
import { useRankTierTransition } from './useRankTierTransition';

function RankEmojiTileInner({
  icon,
  strength,
  size = DEFAULT_TILE_SIZE,
}: RankEmojiTileProps) {
  const v = useMemo(() => getSizeVars(size), [size]);
  const { from, to, toStyle } = useRankTierTransition(strength);
  const { shimmerStyle } = useRankShimmer(
    to.shimmerSpeed,
    v.size,
    v.shimmerWidth
  );

  return (
    <View
      style={[{ width: v.size, height: v.size }, getRankGlow(to, v.glowScale)]}
    >
      <View
        style={[
          baseStyles.tile,
          { width: v.size, height: v.size, borderRadius: v.radius },
        ]}
      >
        <RankGradient tier={from} radius={v.radius} />
        <Animated.View
          style={[
            baseStyles.gradientLayer,
            { borderRadius: v.radius },
            toStyle,
          ]}
        >
          <RankGradient tier={to} radius={v.radius} />
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

export const RankEmojiTile = memo(RankEmojiTileInner);
