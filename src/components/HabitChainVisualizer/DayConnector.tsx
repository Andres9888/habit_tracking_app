import React from 'react';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  useAnimatedTier,
  resolveTierColor,
} from '@/hooks/useAnimatedTier';
import type { DayConnectorProps } from './types';
import { getMaterialTier } from './materialTier';
import { useDayConnectorAnimations } from './useDayConnectorAnimations';

/**
 * DayConnector — visual link between consecutive completed days.
 * Thickness, color, shimmer, and glow all come from the material tier.
 */
export const DayConnector: React.FC<DayConnectorProps> = ({
  accentColor,
  strengthPercent,
  style,
  visible,
}) => {
  const tier = getMaterialTier(strengthPercent);
  const tierAnim = useAnimatedTier(strengthPercent);
  const { opacity, shimmerPosition } = useDayConnectorAnimations({
    shimmerSpeed: tier.shimmerSpeed,
    visible,
  });

  const containerStyle = useAnimatedStyle(() => {
    const fromColor = resolveTierColor(tierAnim.from, accentColor);
    const toColor = resolveTierColor(tierAnim.to, accentColor);
    const blended = interpolateColor(
      tierAnim.progress.value,
      [0, 1],
      [fromColor, toColor]
    );
    return {
      backgroundColor: blended,
      opacity: opacity.value * tier.connectorOpacity,
      shadowColor: blended,
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: tier.glow ? 0.4 : 0,
      shadowRadius: tier.glow ? 3 : 0,
    };
  });

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shimmerPosition.value, [0, 1], [-20, 34]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          borderRadius: tier.connectorHeight / 2,
          height: tier.connectorHeight,
          minWidth: 14,
          overflow: 'hidden',
        },
        containerStyle,
        style,
      ]}
    >
      {tier.shimmerSpeed > 0 ? (
        <Animated.View
          style={[
            {
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: tier.connectorHeight,
              height: '100%',
              position: 'absolute',
              width: 20,
            },
            shimmerStyle,
          ]}
        />
      ) : null}
    </Animated.View>
  );
};
