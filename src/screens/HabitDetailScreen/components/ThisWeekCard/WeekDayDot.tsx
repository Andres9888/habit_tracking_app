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

const DOT = 34;
const STATE_LABEL: Record<WeekDay['state'], string> = {
  done: 'done',
  missed: 'missed',
  off: 'not scheduled',
  today: 'today, not yet done',
  upcoming: 'upcoming',
};

interface WeekDayDotProps {
  day: WeekDay;
  palette: InsightPalette;
  onPress: (date: string, isCompleted: boolean) => void;
}

function dotStyle(state: WeekDay['state'], palette: InsightPalette) {
  if (state === 'done') return { backgroundColor: palette.green };
  if (state === 'today') {
    return { borderColor: palette.ctaGreen, borderWidth: 2 };
  }
  if (state === 'missed') {
    return {
      borderColor: palette.missedRing,
      borderStyle: 'dashed' as const,
      borderWidth: 1.5,
    };
  }
  if (state === 'off') return { backgroundColor: palette.cellFuture };
  return { backgroundColor: palette.cellEmpty };
}

export function WeekDayDot({ day, onPress, palette }: WeekDayDotProps) {
  const isEmphasised = day.state === 'today' || day.state === 'done';

  return (
    <Pressable
      accessibilityLabel={`${day.date}, ${STATE_LABEL[day.state]}`}
      accessibilityRole='button'
      hitSlop={5}
      style={{
        alignItems: 'center',
        gap: 7,
        justifyContent: 'center',
        minHeight: 44,
        minWidth: 40,
      }}
      onPress={() => onPress(day.date, day.state === 'done')}
    >
      <Text
        style={{
          color:
            day.state === 'today' ? palette.ctaGreen : palette.textTertiary,
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
        {day.state === 'done' ? (
          <Check color={palette.onGreen} size={15} strokeWidth={3} />
        ) : null}
      </View>
      <Text
        style={{
          color:
            day.state === 'today' ? palette.textSecondary : palette.textTertiary,
          fontSize: 11,
          fontVariant: ['tabular-nums'],
          fontWeight: day.state === 'today' ? fontWeights.semibold : undefined,
        }}
      >
        {day.dayNum}
      </Text>
    </Pressable>
  );
}
