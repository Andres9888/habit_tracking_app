import React from 'react';
import { type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import type { TimelineConnectorStrength } from '../connectorStrength';

const SHIMMER_WIDTH = 20;

type AnimatedStyle = ReturnType<
  typeof import('react-native-reanimated').useAnimatedStyle
>;

interface ConnectorArmProps {
  side: 'left' | 'right';
  isGhost: boolean;
  colorStyle: AnimatedStyle;
  ringHalf: number;
  armBase: ViewStyle;
  strength: TimelineConnectorStrength;
  glowStyle?: AnimatedStyle;
  ghostPulseStyle: AnimatedStyle;
  shimmerStyle: AnimatedStyle;
  hasShimmer: boolean;
}

const ConnectorArmComponent: React.FC<ConnectorArmProps> = ({
  side,
  isGhost,
  colorStyle,
  ringHalf,
  armBase,
  strength,
  glowStyle,
  ghostPulseStyle,
  shimmerStyle,
  hasShimmer,
}) => {
  const posStyle: ViewStyle =
    side === 'left'
      ? { left: 0, right: '50%', marginRight: ringHalf }
      : { left: '50%', marginLeft: ringHalf, right: 0 };

  if (isGhost) {
    return (
      <Animated.View
        style={[armBase, posStyle, colorStyle, ghostPulseStyle]}
      />
    );
  }

  return (
    <Animated.View
      style={[
        armBase,
        posStyle,
        { opacity: strength.opacity },
        colorStyle,
        glowStyle,
      ]}
    >
      {hasShimmer ? <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              width: SHIMMER_WIDTH,
              height: '100%',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: strength.height,
            },
            shimmerStyle,
          ]}
        /> : null}
    </Animated.View>
  );
};

export const ConnectorArm = React.memo(ConnectorArmComponent);
