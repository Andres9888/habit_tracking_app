/**
 * WeekColumn — one Monday-first column of the year grid.
 *
 * A ~5pt cell is too small to press safely, so the WEEK is the target: pressing
 * it jumps the month calendar to that week rather than writing anything.
 */
import { format } from 'date-fns';
import { Pressable, View } from 'react-native';
import { parseLocalDate } from '../../insights';
import type { InsightPalette } from '../../insightPalette';
import { monthCellColor, monthCellOpacity } from './monthCells';
import type { YearCell } from './yearCells';

/** Gap between cells and between week columns; shared with YearGrid. */
export const GAP = 2;

interface WeekColumnProps {
  cell: number;
  palette: InsightPalette;
  week: (YearCell | null)[];
  onPress: (date: string) => void;
}

export function WeekColumn({ cell, palette, week, onPress }: WeekColumnProps) {
  const first = week.find((day): day is YearCell => day !== null);
  const label = first
    ? `Week of ${format(parseLocalDate(first.date), 'MMM d')}`
    : 'Empty week';

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole='button'
      style={{ gap: GAP }}
      onPress={first ? () => onPress(first.date) : undefined}
    >
      {Array.from({ length: 7 }, (_, row) => {
        const day = week[row] ?? null;
        return (
          <View
            key={row}
            style={{
              backgroundColor: day
                ? monthCellColor(day.state, palette)
                : 'transparent',
              borderColor:
                day?.state === 'open-today' ? palette.green : 'transparent',
              borderRadius: 1.5,
              borderWidth: day?.state === 'open-today' ? 1 : 0,
              height: cell,
              opacity: day ? monthCellOpacity(day.state) : 1,
              width: cell,
            }}
          />
        );
      })}
    </Pressable>
  );
}
