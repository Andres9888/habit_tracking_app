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
        [isEnd ? 'right' : 'left']: -10,
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
