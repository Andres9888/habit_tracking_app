/* eslint-disable max-lines */
/**
 * WeekDayDot — one circle in the week strip. Tapping toggles that day, so the
 * pressable is padded out to a 44pt target even though the circle is 34pt.
 */
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import type { WeekDay } from './useThisWeek';
import { formatDayShort } from '../DayDetailScreen/dayCopy';
import { habitDayStateLabel } from '../../../../features/habits/habitDayState';

const DOT = 34;
interface WeekDayDotProps {
  day: WeekDay;
  palette: InsightPalette;
  onPress: (date: string, isCompleted: boolean) => void;
}

function dotStyle(state: WeekDay['state'], palette: InsightPalette) {
  if (state === 'completed') return { backgroundColor: palette.green };
  if (state === 'open-today') {
    return {
      backgroundColor: palette.card,
      borderColor: palette.ctaGreen,
      borderWidth: 2,
    };
  }
  if (state === 'missed') {
    return {
      borderColor: palette.missedRing,
      borderStyle: 'dashed' as const,
      borderWidth: 1.5,
    };
  }
  if (
    state === 'before-creation' ||
    state === 'unscheduled' ||
    state === 'paused'
  ) {
    return { backgroundColor: palette.cellFuture };
  }
  return { backgroundColor: palette.cellEmpty };
}

export function WeekDayDot({ day, onPress, palette }: WeekDayDotProps) {
  const isEmphasised = day.state === 'open-today' || day.state === 'completed';
  const isInteractive =
    day.state !== 'before-creation' &&
    day.state !== 'upcoming' &&
    day.state !== 'unscheduled' &&
    !(day.state === 'paused' && day.isToday);

  return (
    <Pressable
      accessibilityHint={
        isInteractive ? 'Opens or updates this day' : undefined
      }
      accessibilityLabel={`${formatDayShort(day.date)}, ${habitDayStateLabel(day.state)}`}
      accessibilityRole={isInteractive ? 'button' : 'text'}
      accessibilityState={{ disabled: !isInteractive }}
      disabled={!isInteractive}
      hitSlop={5}
      style={{
        alignItems: 'center',
        gap: 7,
        justifyContent: 'center',
        minHeight: 44,
        minWidth: 40,
      }}
      onPress={() => onPress(day.date, day.state === 'completed')}
    >
      <Text
        style={{
          color:
            day.state === 'open-today'
              ? palette.ctaGreen
              : palette.textTertiary,
          fontSize: 11,
          fontWeight: isEmphasised ? fontWeights.bold : fontWeights.regular,
        }}
      >
        {day.short}
      </Text>
      <View
        style={{
          alignItems: 'center',
          borderRadius: borderRadius.full,
          height: DOT,
          justifyContent: 'center',
          width: DOT,
          ...dotStyle(day.state, palette),
        }}
      >
        {day.state === 'completed' ? (
          <Check color={palette.onGreen} size={15} strokeWidth={3} />
        ) : null}
        {day.state === 'open-today' ? (
          <View
            style={{
              backgroundColor: palette.ctaGreen,
              borderRadius: 3,
              height: 6,
              width: 6,
            }}
          />
        ) : null}
      </View>
      <Text
        style={{
          color:
            day.state === 'open-today'
              ? palette.textSecondary
              : palette.textTertiary,
          fontSize: 11,
          fontVariant: ['tabular-nums'],
          fontWeight:
            day.state === 'open-today' ? fontWeights.semibold : undefined,
        }}
      >
        {day.dayNum}
      </Text>
    </Pressable>
  );
}
