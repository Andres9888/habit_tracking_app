/**
 * ChainDayBody — round "link" visual for shape='circle'. Filled + fused when
 * completed and joined, open dashed ring with a static dotted trace when
 * missed, muted ring when future/outside-month, soft halo when today.
 */
import { View } from 'react-native';
import { colors } from '@/theme/colors';
import { hexToRgba } from './colors';
import { ChainDayBodyOverlays } from './ChainDayBodyOverlays';
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

  const dotStyle = showCompleted
    ? { backgroundColor: habitColor, borderColor: colors.primary[600] }
    : showMissed
      ? {
          backgroundColor: colors.light.cardElevated,
          borderColor: colors.gray[300],
          borderStyle: 'dashed' as const,
        }
      : { backgroundColor: colors.gray[100], borderColor: 'transparent' };

  return (
    <View
      className='relative items-center justify-center'
      style={{ width: 36, height: 40 }}
    >
      <View
        testID='chain-day-dot'
        style={[
          {
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: DOT_SIZE / 2,
            borderWidth: 2,
          },
          dotStyle,
          // Today halo only while incomplete: a completed today must keep the
          // solid completed border and paint fully filled like its neighbors.
          isToday && !showCompleted
            ? {
                borderColor: hexToRgba(colors.primary[500], 0.25),
                borderWidth: 3,
              }
            : null,
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
