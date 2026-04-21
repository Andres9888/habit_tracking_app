/**
 * ChainConnector - Week connector for HabitChainVisualizer
 * Connects the chain to previous/next weeks when streak continues
 */

import React from 'react';
import { View } from 'react-native';
import { DayConnector } from './DayConnector';

interface ChainConnectorProps {
  visible: boolean;
  accentColor: string;
  strengthPercent: number;
  position?: 'start' | 'end';
}

export function ChainConnector({
  visible,
  accentColor,
  strengthPercent,
  position = 'start',
}: ChainConnectorProps) {
  if (!visible) return null;

  const isEnd = position === 'end';

  // The connector spans from the card edge to the habit square.
  // Position: -10px outside container, extends ~28px to reach the square center.
  // Height uses the same 3px as between-day connectors for visual consistency.
  // marginTop: -1.5 vertically centers the 3px line (matching ChainDayItem's connector)
  const connectorWidth = 28;

  return (
    <View
      pointerEvents='none'
      style={{
        height: 3,
        [isEnd ? 'right' : 'left']: -10,
        marginTop: -1.5,
        position: 'absolute',
        top: '50%',
        width: connectorWidth,
        zIndex: -1,
      }}
    >
      <DayConnector
        visible
        accentColor={accentColor}
        strengthPercent={strengthPercent}
        style={{ width: '100%' }}
      />
    </View>
  );
}
