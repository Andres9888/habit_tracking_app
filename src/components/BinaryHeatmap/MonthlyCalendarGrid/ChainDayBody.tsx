/**
 * ChainDayBody — round "link" visual for shape='circle'. Filled + fused when
 * completed and joined, open dashed ring with a static dotted trace when
 * missed, muted ring when future/outside-month, soft halo when today.
 * Fill/clear is one shared color fade (useChainDayFill) on the same clock as
 * the connectors, so toggling reads as a single motion.
 */
import Animated from 'react-native-reanimated';
import { View } from 'react-native';
import { colors } from '@/theme/colors';
import { hexToRgba } from './colors';
import { ChainDayBodyOverlays } from './ChainDayBodyOverlays';
import { useChainDayFill } from './useChainDayFill';
import type { DayData } from './types';

interface ChainDayBodyProps {
  day: DayData;
  habitColor: string;
  connectorStyle: 'none' | 'small' | 'full';
  joinRight: boolean;
}

const DOT_SIZE = 28;

export function ChainDayBody({
  day,
  habitColor,
  connectorStyle,
  joinRight,
}: ChainDayBodyProps) {
  const showCompleted = Boolean(
    day?.isCompleted && day?.isCurrentMonth && !day?.isFuture
  );
  const showMissed = Boolean(
    day?.isMissed && day?.isCurrentMonth && !day?.isFuture
  );
  const isToday = Boolean(day?.isToday);
  const showMissedTrace = showMissed && connectorStyle !== 'none';

  const animatedFillStyle = useChainDayFill(
    showCompleted,
    // Today halo only while incomplete: a completed today must keep the
    // solid completed border and paint fully filled like its neighbors.
    isToday && !showCompleted,
    {
      baseBg: showMissed ? colors.light.cardElevated : colors.gray[100],
      baseBorder: showMissed
        ? colors.gray[300]
        : hexToRgba(colors.primary[600], 0),
      completedBg: habitColor,
      completedBorder: colors.primary[600],
      haloBorder: hexToRgba(colors.primary[500], 0.25),
    }
  );

  return (
    <View
      className='relative items-center justify-center'
      style={{ width: 36, height: 40 }}
    >
      <Animated.View
        testID='chain-day-dot'
        style={[
          {
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: DOT_SIZE / 2,
          },
          showMissed && !showCompleted
            ? { borderStyle: 'dashed' as const }
            : null,
          animatedFillStyle,
        ]}
      />
      <ChainDayBodyOverlays
        habitColor={habitColor}
        connectorStyle={connectorStyle}
        joinRight={joinRight}
        showMissedTrace={showMissedTrace}
      />
    </View>
  );
}
