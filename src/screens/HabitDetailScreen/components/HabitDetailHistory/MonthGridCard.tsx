/**
 * MonthGridCard — one month of squares: serif month name, an optional
 * completion rate, and a Monday-first grid you can navigate and correct.
 *
 * This is the only calendar on History. Cells carry their day number, because a
 * coloured square says a day was missed and a numbered one says WHICH day —
 * which is what you need in order to open it and put it right.
 */
import type { ReactNode } from 'react';
import { format } from 'date-fns';
import { View } from 'react-native';
import type {
  HabitDayContext,
  HabitDayState,
} from '../../../../features/habits/habitDayState';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import type { MonthRate } from '../../insights';
import type { InsightPalette } from '../../insightPalette';
import { InsightCard } from '../InsightCard';
import { buildMonthCells } from './monthCells';
import { MonthGridCardHeader } from './MonthGridCardHeader';
import type { MonthNavigation } from './MonthNavButtons';
import { MonthGridCell } from './MonthGridCell';
import { MonthGridHeader } from './MonthGridHeader';

interface MonthGridCardProps {
  completedDates: Set<string>;
  /**
   * Rendered inside the card under the grid — History passes the legend,
   * given the set of states this month actually shows so it only lists those.
   */
  footer?: (present: ReadonlySet<HabitDayState>) => ReactNode;
  isBest?: boolean;
  /** Any day inside the month to render. */
  month: Date;
  /** Chevrons in the header; omitted where the card cannot be paged. */
  navigation?: MonthNavigation;
  notes?: Record<string, string>;
  palette: InsightPalette;
  /** Omitted for months with no settled rate — no rate is fabricated. */
  rate?: MonthRate;
  schedule: HabitDayContext;
  onOpenDay?: (date: string) => void;
}

export function MonthGridCard({
  completedDates,
  footer,
  isBest = false,
  month,
  navigation,
  notes,
  palette,
  rate,
  schedule,
  onOpenDay,
}: MonthGridCardProps) {
  const today = getLocalDateString();
  const label = format(month, 'MMMM');
  const cells = buildMonthCells({
    completedDates,
    month: month.getMonth(),
    notes,
    schedule,
    today,
    year: month.getFullYear(),
  });

  return (
    <InsightCard palette={palette}>
      <MonthGridCardHeader
        isBest={isBest}
        label={label}
        navigation={navigation}
        palette={palette}
        rate={rate}
      />
      <MonthGridHeader palette={palette} />
      <View
        accessibilityLabel={
          rate
            ? `${label}: ${rate.done} of ${rate.scheduled} days`
            : `${label} calendar`
        }
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: -3,
          marginTop: 6,
        }}
      >
        {cells.map((cell, index) => (
          <MonthGridCell
            key={cell?.date ?? `blank-${index}`}
            cell={cell}
            palette={palette}
            onPress={
              cell && cell.date <= today && cell.state !== 'before-creation'
                ? onOpenDay
                : undefined
            }
          />
        ))}
      </View>
      {footer ? footer(presentStates(cells)) : null}
    </InsightCard>
  );
}

/** States actually shown by this month's cells, in cell order. */
function presentStates(
  cells: ReturnType<typeof buildMonthCells>
): ReadonlySet<HabitDayState> {
  const present = new Set<HabitDayState>();
  for (const cell of cells) if (cell) present.add(cell.state);
  return present;
}
