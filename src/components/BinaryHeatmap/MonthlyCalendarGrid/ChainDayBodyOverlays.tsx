/**
 * ChainDayBodyOverlays — the join bar, small DayConnector, and missed-day
 * dotted trace stubs for ChainDayBody. Split out to keep ChainDayBody.tsx
 * under the project's 100-line cap. Every overlay mounts/unmounts through
 * OverlayFadeView so it moves on the same clock as the dot's fill fade.
 */
import { colors } from '@/theme/colors';
import { DayConnector } from '../../HabitChainVisualizer/DayConnector';
import { SMALL_CONNECTOR_STRENGTH } from './chainLinkHelpers';
import { OverlayFadeView } from './OverlayFadeView';

interface ChainDayBodyOverlaysProps {
  habitColor: string;
  connectorStyle: 'none' | 'small' | 'full';
  joinRight: boolean;
  showMissedTrace: boolean;
}

const traceStyle = {
  position: 'absolute' as const,
  top: '50%' as const,
  width: 10,
  borderTopWidth: 2,
  borderStyle: 'dotted' as const,
  borderTopColor: colors.gray[300],
};

export function ChainDayBodyOverlays({
  habitColor,
  connectorStyle,
  joinRight,
  showMissedTrace,
}: ChainDayBodyOverlaysProps) {
  const showJoinBar = connectorStyle === 'full' && joinRight;
  const showSmallConnector = connectorStyle === 'small' && joinRight;

  return (
    <>
      {showJoinBar ? (
        <OverlayFadeView
          testID='chain-join-bar'
          style={{
            position: 'absolute',
            right: -2,
            top: '50%',
            marginTop: -4,
            width: 12,
            height: 8,
            backgroundColor: colors.primary[500],
          }}
        />
      ) : null}
      {showSmallConnector ? (
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
      ) : null}
      {showMissedTrace ? (
        <>
          <OverlayFadeView
            testID='chain-missed-trace-left'
            style={{ ...traceStyle, left: -1 }}
          />
          <OverlayFadeView
            testID='chain-missed-trace-right'
            style={{ ...traceStyle, right: -1 }}
          />
        </>
      ) : null}
    </>
  );
}
