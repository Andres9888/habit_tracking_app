import React from 'react';
import { type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import type { TimelineConnectorStrength } from '../connectorStrength';

const SHIMMER_WIDTH = 20;

interface ConnectorArmProps {
  side: 'left' | 'right';
  isGhost: boolean;
  color: string;
  ringHalf: number;
  armBase: ViewStyle;
  strength: TimelineConnectorStrength;
  glowStyle?: ViewStyle;
  ghostPulseStyle: ReturnType<typeof import('react-native-reanimated').useAnimatedStyle>;
  shimmerStyle: ReturnType<typeof import('react-native-reanimated').useAnimatedStyle>;
  hasShimmer: boolean;
}

export const ConnectorArm: React.FC<ConnectorArmProps> = ({
  side,
  isGhost,
  color,
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
        style={[armBase, posStyle, { backgroundColor: color }, ghostPulseStyle]}
      />
    );
  }

  return (
    <Animated.View
      style={[
        armBase,
        posStyle,
        { backgroundColor: color, opacity: strength.opacity },
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
