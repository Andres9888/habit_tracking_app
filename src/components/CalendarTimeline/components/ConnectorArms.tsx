import React, { useMemo } from 'react';
import { type ViewStyle } from 'react-native';

import { STREAK_CONNECTOR } from '../CalendarTimeline.styles';
import { getTimelineConnectorStrength } from '../connectorStrength';
import { useConnectorShimmer } from '../hooks/useConnectorShimmer';
import { useGhostPulse } from '../hooks/useGhostPulse';
import { useAnimatedTier } from '@/hooks/useAnimatedTier';
import { RING_SIZE } from './DayCellRing.styles';
import { ConnectorArm } from './ConnectorArm';
import { useConnectorArmsTierStyles } from './useConnectorArmsTierStyles';

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

const ConnectorArmsComponent: React.FC<ConnectorArmsProps> = ({
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
  const tierAnim = useAnimatedTier(strengthPercent);
  const { colorStyle, ghostColorStyle, glowStyle } = useConnectorArmsTierStyles({
    tierAnim,
    streakConnectorColor,
    ghostConnectorColor,
    glow: strength.glow,
  });

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
          colorStyle={
            ghostLeft && !connectLeft ? ghostColorStyle : colorStyle
          }
          isGhost={ghostLeft && !connectLeft}
          side='left'
        />
      ) : null}
      {(connectRight || ghostRight) ? (
        <ConnectorArm
          {...shared}
          colorStyle={
            ghostRight && !connectRight ? ghostColorStyle : colorStyle
          }
          isGhost={ghostRight && !connectRight}
          side='right'
        />
      ) : null}
    </>
  );
};

export const ConnectorArms = React.memo(ConnectorArmsComponent);
