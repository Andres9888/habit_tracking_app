/**
 * CalendarDayBodyConnector — small "chain" connector rendered on the square
 * day cell when connectorStyle === 'small' and the day fuses to its right
 * neighbor. Reuses the same DayConnector visual as the full ribbon overlay.
 */
import React from 'react';
import { View } from 'react-native';
import { DayConnector } from '../../HabitChainVisualizer/DayConnector';
import { SMALL_CONNECTOR_STRENGTH } from './chainLinkHelpers';

interface CalendarDayBodyConnectorProps {
  connectorStyle: 'none' | 'small' | 'full';
  habitColor: string;
  joinRight: boolean;
}

export function CalendarDayBodyConnector({
  connectorStyle,
  habitColor,
  joinRight,
}: CalendarDayBodyConnectorProps) {
  if (connectorStyle !== 'small' || !joinRight) return null;

  return (
    <View
      pointerEvents='none'
      style={{
        position: 'absolute',
        right: -6,
        top: '50%',
        marginTop: -1.5,
        width: 14,
      }}
    >
      <DayConnector
        accentColor={habitColor}
        strengthPercent={SMALL_CONNECTOR_STRENGTH}
        visible
      />
    </View>
  );
}
