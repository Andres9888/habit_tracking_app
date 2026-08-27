/**
 * One numbered day in the month grid. Blanks pad the Monday-first offset.
 *
 * A cell is pressable only when the parent hands it an `onPress` — the card
 * withholds it for days you cannot correct (upcoming, before the habit
 * existed), so the future never advertises a button that does nothing.
 */
import { format } from 'date-fns';
import { Pressable, Text, View } from 'react-native';
import { usePressed } from '../../../../components/AdvancedOptions/usePressed';
import { habitDayStateLabel } from '../../../../features/habits/habitDayState';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import { parseLocalDate } from '../../insights';
import type { InsightPalette } from '../../insightPalette';
import {
  monthCellBorder,
  monthCellColor,
  monthCellTextColor,
  type MonthCell,
} from './monthCells';

interface MonthGridCellProps {
  cell: MonthCell | null;
  palette: InsightPalette;
  /** Supplied only for days that can be opened; absence makes the cell inert. */
  onPress?: (date: string) => void;
}

/** "August 12, missed" — the same words the Daily record row uses. */
function cellLabel(cell: MonthCell): string {
  const day = format(parseLocalDate(cell.date), 'MMMM d');
  const label = `${day}, ${habitDayStateLabel(cell.state)}`;
  return cell.hasNote ? `${label}, has note` : label;
}

// Exactly seven per row: 1/7 of the width, with padding as the gap.
const SLOT = { flexBasis: '14.2857%' as const, padding: 3 };

export function MonthGridCell({ cell, palette, onPress }: MonthGridCellProps) {
  const { pressProps, pressed } = usePressed();

  const square = (
    <View
      style={{
        alignItems: 'center',
        aspectRatio: 1,
        backgroundColor: cell
          ? monthCellColor(cell.state, palette)
          : 'transparent',
        borderRadius: borderRadius.small,
        justifyContent: 'center',
        opacity: pressed ? 0.6 : 1,
        ...(cell ? monthCellBorder(cell.state, palette) : null),
      }}
    >
      {cell ? (
        <Text
          style={{
            color: monthCellTextColor(cell.state, palette),
            fontFamily: fontFamilies.primary.text,
            fontSize: 11,
            fontVariant: ['tabular-nums'],
            fontWeight: fontWeights.semibold,
          }}
        >
          {Number(cell.date.slice(8, 10))}
        </Text>
      ) : null}
      {cell?.hasNote ? (
        <View
          style={{
            backgroundColor:
              cell.state === 'completed' ? palette.onGreen : palette.green,
            borderRadius: 2,
            bottom: 3,
            height: 4,
            position: 'absolute',
            width: 4,
          }}
        />
      ) : null}
    </View>
  );

  if (!cell || !onPress) return <View style={SLOT}>{square}</View>;

  return (
    <Pressable
      {...pressProps}
      accessibilityHint='Opens this day so you can correct it'
      accessibilityLabel={cellLabel(cell)}
      accessibilityRole='button'
      style={SLOT}
      onPress={() => onPress(cell.date)}
    >
      {square}
    </Pressable>
  );
}
