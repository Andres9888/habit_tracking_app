import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { STREAK_CONNECTOR } from '../CalendarTimeline.styles';

const armBase: ViewStyle = {
  position: 'absolute',
  top: STREAK_CONNECTOR.topOffset,
  height: STREAK_CONNECTOR.height,
};

interface ConnectorArmsProps {
  connectLeft: boolean;
  connectRight: boolean;
  streakConnectorColor: string;
}

export const ConnectorArms: React.FC<ConnectorArmsProps> = ({
  connectLeft,
  connectRight,
  streakConnectorColor,
}) => (
  <>
    {connectLeft && (
      <View
        style={{
          ...armBase,
          left: 0,
          width: '50%',
          backgroundColor: streakConnectorColor,
        }}
      />
    )}
    {connectRight && (
      <View
        style={{
          ...armBase,
          left: '50%',
          width: '50%',
          backgroundColor: streakConnectorColor,
        }}
      />
    )}
  </>
);
