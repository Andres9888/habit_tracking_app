import { Text, View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { RankTier } from '../rankTier';
import { baseStyles, getSizeVars } from './RankEmojiTile.styles';
import { getRankGlow, RankGradient } from './RankEmojiTileLayers';

type SizeVars = ReturnType<typeof getSizeVars>;

interface RankEmojiTileViewProps {
  from: RankTier;
  icon: string;
  shimmerStyle: AnimatedStyle;
  to: RankTier;
  toStyle: AnimatedStyle;
  vars: SizeVars;
}

export function RankEmojiTileView({
  from,
  icon,
  shimmerStyle,
  to,
  toStyle,
  vars,
}: RankEmojiTileViewProps) {
  return (
    <View
      style={[
        { height: vars.size, width: vars.size },
        getRankGlow(to, vars.glowScale),
      ]}
    >
      <View
        style={[
          baseStyles.tile,
          {
            borderRadius: vars.radius,
            height: vars.size,
            width: vars.size,
          },
        ]}
      >
        <RankGradient radius={vars.radius} tier={from} />
        <Animated.View
          style={[
            baseStyles.gradientLayer,
            { borderRadius: vars.radius },
            toStyle,
          ]}
        >
          <RankGradient radius={vars.radius} tier={to} />
        </Animated.View>
        <View
          pointerEvents='none'
          style={[
            baseStyles.highlight,
            {
              backgroundColor: to.highlight,
              borderRadius: vars.radius - 2,
              height: vars.highlightHeight,
              top: vars.highlightTop,
            },
          ]}
        />
        {to.shimmerSpeed > 0 ? (
          <Animated.View
            pointerEvents='none'
            style={[
              baseStyles.shimmer,
              {
                borderRadius: vars.radius,
                height: vars.size * 1.4,
                top: -vars.size * 0.2,
                width: vars.shimmerWidth,
              },
              shimmerStyle,
            ]}
          />
        ) : null}
        <Text
          allowFontScaling={false}
          style={[
            baseStyles.emoji,
            {
              fontSize: vars.emojiFontSize,
              lineHeight: vars.emojiLineHeight,
            },
          ]}
        >
          {icon}
        </Text>
      </View>
    </View>
  );
}
