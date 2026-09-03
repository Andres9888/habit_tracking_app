import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useInsightPalette } from '../../insightPalette';
import type { HabitDayState } from '../../../../features/habits/habitDayState';

/** Leading swatch for one History row — mirrors the HistoryLegend swatches. */
export function EntryMark({ state }: { state: HabitDayState }) {
  const palette = useInsightPalette();
  const done = state === 'completed';
  const isPaused = state === 'paused';
  // Paused reads as a half-strength green so it stays distinct from the plain
  // "not scheduled" cell the legend lists beside it.
  const isNeutral = state === 'unscheduled' || isPaused;
  const isToday = state === 'open-today';
  const isFuture = state === 'upcoming' || state === 'before-creation';
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: done
          ? palette.green
          : isPaused
            ? palette.greenSoft
            : isNeutral
              ? palette.cellFuture
              : undefined,
        borderColor: done || isToday ? palette.green : palette.missedRing,
        borderRadius: 7,
        borderStyle: done || isNeutral || isToday ? 'solid' : 'dashed',
        borderWidth: isNeutral ? 0 : 1.5,
        height: 26,
        justifyContent: 'center',
        opacity: isFuture ? 0.55 : 1,
        width: 26,
      }}
    >
      {done ? (
        <Check color={palette.onGreen} size={14} strokeWidth={2.4} />
      ) : null}
    </View>
  );
}
