/**
 * ChainDayBodyOverlays — the join bar, small DayConnector, and missed-day
 * dotted trace stubs for ChainDayBody. Split out to keep ChainDayBody.tsx
 * under the project's 100-line cap.
 */
import { View } from 'react-native';
import { colors } from '@/theme/colors';
import { DayConnector } from '../../HabitChainVisualizer/DayConnector';
import { SMALL_CONNECTOR_STRENGTH } from './chainLinkHelpers';

interface ChainDayBodyOverlaysProps {
  habitColor: string;
  connectorStyle: 'none' | 'small' | 'full';
  joinRight: boolean;
  showMissedTrace: boolean;
}

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
        <View
          testID='chain-join-bar'
          pointerEvents='none'
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
        <View
          testID='chain-small-connector'
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
      ) : null}
      {showMissedTrace ? (
        <>
          <View
            testID='chain-missed-trace-left'
            pointerEvents='none'
            style={{
              position: 'absolute',
              left: -1,
              top: '50%',
              width: 10,
              borderTopWidth: 2,
              borderStyle: 'dotted',
              borderTopColor: colors.gray[300],
            }}
          />
          <View
            testID='chain-missed-trace-right'
            pointerEvents='none'
            style={{
              position: 'absolute',
              right: -1,
              top: '50%',
              width: 10,
              borderTopWidth: 2,
              borderStyle: 'dotted',
              borderTopColor: colors.gray[300],
            }}
          />
        </>
      ) : null}
    </>
  );
}
