/**
 * ChainConnector - Previous week connector for HabitChainVisualizer
 */

import React from 'react';
import { View } from 'react-native';
import { DayConnector } from './DayConnector';

interface ChainConnectorProps {
  visible: boolean;
  accentColor: string;
  connectorColor: string;
  currentStreak: number;
}

export function ChainConnector({
  visible,
  accentColor,
  connectorColor,
  currentStreak,
}: ChainConnectorProps) {
  if (!visible) return null;

  return (
    <View
      style={{
        left: -10,
        marginTop: -1,
        position: 'absolute',
        top: '50%',
        zIndex: -1,
      }}
    >
      <DayConnector
        visible
        accentColor={accentColor}
        baseColor={connectorColor}
        currentStreak={currentStreak}
      />
    </View>
  );
}
