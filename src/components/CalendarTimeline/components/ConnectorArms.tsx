import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { STREAK_CONNECTOR } from '../CalendarTimeline.styles';
import { RING_SIZE } from './DayCellRing.styles';

const RING_HALF = RING_SIZE / 2;

const armBase: ViewStyle = {
  position: 'absolute',
  top: STREAK_CONNECTOR.topOffset,
  height: STREAK_CONNECTOR.height,
};

interface ConnectorArmsProps {
  connectLeft: boolean;
  connectRight: boolean;
  streakConnectorColor: string;
  /** Ghost arm on left — chain "waiting" cue (Zeigarnik effect) */
  ghostLeft?: boolean;
  /** Ghost arm on right — reaching toward today */
  ghostRight?: boolean;
}

export const ConnectorArms: React.FC<ConnectorArmsProps> = ({
  connectLeft,
  connectRight,
  streakConnectorColor,
  ghostLeft = false,
  ghostRight = false,
}) => (
  <>
    {(connectLeft || ghostLeft) && (
      <View
        style={{
          ...armBase,
          left: 0,
          right: `50%`,
          marginRight: RING_HALF,
          backgroundColor: streakConnectorColor,
          opacity: ghostLeft && !connectLeft ? 0.5 : 1,
        }}
      />
    )}
    {(connectRight || ghostRight) && (
      <View
        style={{
          ...armBase,
          left: `50%`,
          marginLeft: RING_HALF,
          right: 0,
          backgroundColor: streakConnectorColor,
          opacity: ghostRight && !connectRight ? 0.5 : 1,
        }}
      />
    )}
  </>
);
