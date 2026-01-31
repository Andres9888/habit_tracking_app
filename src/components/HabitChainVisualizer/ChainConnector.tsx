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
  connectorColor: string;
  currentStreak: number;
  position?: 'start' | 'end';
}

export function ChainConnector({
  visible,
  accentColor,
  connectorColor,
  currentStreak,
  position = 'start',
}: ChainConnectorProps) {
  if (!visible) return null;

  const isEnd = position === 'end';

  return (
    <View
      style={{
        [isEnd ? 'right' : 'left']: 0,
        marginTop: -1.5,
        position: 'absolute',
        top: '50%',
        width: 18, // Extend from edge to center of first/last button
        zIndex: -1,
      }}
    >
      <DayConnector
        visible
        accentColor={accentColor}
        baseColor={connectorColor}
        currentStreak={currentStreak}
        style={{ flex: 1 }}
      />
    </View>
  );
}
