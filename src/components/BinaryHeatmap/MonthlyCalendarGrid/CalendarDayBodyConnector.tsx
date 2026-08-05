/**
 * CalendarDayBodyConnector — small "chain" connector rendered on the square
 * day cell when connectorStyle === 'small' and the day fuses to its right
 * neighbor. Reuses the same DayConnector visual as the full ribbon overlay,
 * fading in/out through OverlayFadeView on the shared cell-toggle clock.
 */
import React from 'react';
import { DayConnector } from '../../HabitChainVisualizer/DayConnector';
import { SMALL_CONNECTOR_STRENGTH } from './chainLinkHelpers';
import { OverlayFadeView } from './OverlayFadeView';

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
    <OverlayFadeView
      testID='chain-small-connector'
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
    </OverlayFadeView>
  );
}
