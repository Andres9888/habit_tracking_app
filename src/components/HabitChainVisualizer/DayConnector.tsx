import React from 'react';
import { Animated } from 'react-native';
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
  const connectorColor = tier.useAccent ? accentColor : tier.tierColor;
  const glowColor = tier.useAccent ? accentColor : tier.tierColor;

  const { opacity, shimmerPosition } = useDayConnectorAnimations({
    shimmerSpeed: tier.shimmerSpeed,
    visible,
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: connectorColor,
          borderRadius: tier.connectorHeight / 2,
          height: tier.connectorHeight,
          minWidth: 14,
          opacity: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, tier.connectorOpacity],
          }),
          overflow: 'hidden',
        },
        tier.glow && {
          shadowColor: glowColor,
          shadowOffset: { height: 0, width: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 3,
        },
        style,
      ]}
    >
      {tier.shimmerSpeed > 0 ? <Animated.View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: tier.connectorHeight,
            height: '100%',
            position: 'absolute',
            transform: [
              {
                translateX: shimmerPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 34],
                }),
              },
            ],
            width: 20,
          }}
        /> : null}
    </Animated.View>
  );
};
