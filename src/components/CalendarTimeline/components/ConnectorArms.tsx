import React, { useMemo } from 'react';
import { type ViewStyle } from 'react-native';

import { STREAK_CONNECTOR } from '../CalendarTimeline.styles';
import { getTimelineConnectorStrength } from '../connectorStrength';
import { useConnectorShimmer } from '../hooks/useConnectorShimmer';
import { useGhostPulse } from '../hooks/useGhostPulse';
import { getMaterialTier } from '../../HabitChainVisualizer/materialTier';
import { RING_SIZE } from './DayCellRing.styles';
import { ConnectorArm } from './ConnectorArm';

const RING_HALF = RING_SIZE / 2;

interface ConnectorArmsProps {
  connectLeft: boolean;
  connectRight: boolean;
  streakConnectorColor: string;
  ghostLeft?: boolean;
  ghostRight?: boolean;
  ghostConnectorColor?: string;
  currentStreak?: number;
  strengthPercent?: number;
  reduceMotion?: boolean;
}

export const ConnectorArms: React.FC<ConnectorArmsProps> = ({
  connectLeft,
  connectRight,
  streakConnectorColor,
  ghostLeft = false,
  ghostRight = false,
  ghostConnectorColor,
  strengthPercent = 0,
  reduceMotion = false,
}) => {
  const strength = useMemo(
    () => getTimelineConnectorStrength(strengthPercent),
    [strengthPercent]
  );
  const tier = useMemo(() => getMaterialTier(strengthPercent), [strengthPercent]);
  const effectiveColor = tier.useAccent ? streakConnectorColor : tier.tierColor;

  const hasGhost = (ghostLeft && !connectLeft) || (ghostRight && !connectRight);
  const ghostPulseStyle = useGhostPulse(hasGhost, reduceMotion);
  const { shimmerStyle, active: hasShimmer } = useConnectorShimmer({
    shimmerSpeed: strength.shimmerSpeed,
    reduceMotion,
  });

  const armBase: ViewStyle = {
    position: 'absolute',
    top: STREAK_CONNECTOR.topOffset,
    height: strength.height,
    borderRadius: strength.height / 2,
    overflow: 'hidden',
  };

  const glowStyle: ViewStyle | undefined = strength.glow
    ? {
        shadowColor: effectiveColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      }
    : undefined;

  const getColor = (isGhost: boolean) =>
    isGhost ? (ghostConnectorColor ?? effectiveColor) : effectiveColor;

  const shared = {
    armBase,
    ghostPulseStyle,
    glowStyle,
    hasShimmer,
    ringHalf: RING_HALF,
    shimmerStyle,
    strength,
  };

  return (
    <>
      {(connectLeft || ghostLeft) ? (
        <ConnectorArm
          {...shared}
          color={getColor(ghostLeft && !connectLeft)}
          isGhost={ghostLeft && !connectLeft}
          side='left'
        />
      ) : null}
      {(connectRight || ghostRight) ? (
        <ConnectorArm
          {...shared}
          color={getColor(ghostRight && !connectRight)}
          isGhost={ghostRight && !connectRight}
          side='right'
        />
      ) : null}
    </>
  );
};
