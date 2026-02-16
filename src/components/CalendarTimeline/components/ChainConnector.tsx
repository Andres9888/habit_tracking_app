import React from 'react';
import { View } from 'react-native';

import {
  CHAIN_CONNECTOR_COLOR,
  CHAIN_CONNECTOR_COLOR_DARK,
} from '../CalendarTimeline.styles';

interface ChainConnectorProps {
  isDark?: boolean;
}

/**
 * A horizontal line connecting two consecutive completed day dots,
 * visualizing an active streak / "chain".
 */
export const ChainConnector: React.FC<ChainConnectorProps> = ({ isDark = false }) => (
  <View
    style={{
      backgroundColor: isDark ? CHAIN_CONNECTOR_COLOR_DARK : CHAIN_CONNECTOR_COLOR,
      height: 2,
      flex: 1,
      marginHorizontal: -2,
      borderRadius: 1,
      opacity: 0.6,
    }}
  />
);
