import React from 'react';
import { Animated } from 'react-native';
import type { DayConnectorProps } from './types';
import { getStrengthConfig } from './strengthConfig';
import { useDayConnectorAnimations } from './useDayConnectorAnimations';

/**
 * DayConnector - Visual link between consecutive completed days
 * Features strength-based evolution with shimmer effect for longer streaks.
 */
export const DayConnector: React.FC<DayConnectorProps> = ({
  accentColor,
  baseColor,
  currentStreak,
  style,
  visible,
}) => {
  const strengthConfig = getStrengthConfig(currentStreak);
  const connectorColor = strengthConfig.useAccent ? accentColor : baseColor;

  const { opacity, shimmerPosition } = useDayConnectorAnimations({
    shimmerSpeed: strengthConfig.shimmerSpeed,
    visible,
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: connectorColor,
          borderRadius: strengthConfig.height / 2,
          height: strengthConfig.height,
          minWidth: 14,
          opacity: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, strengthConfig.maxOpacity],
          }),
          overflow: 'hidden',
        },
        strengthConfig.useAccent &&
          currentStreak >= 30 && {
            shadowColor: accentColor,
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 3,
          },
        style,
      ]}
    >
      {strengthConfig.shimmerSpeed > 0 ? <Animated.View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: strengthConfig.height,
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
