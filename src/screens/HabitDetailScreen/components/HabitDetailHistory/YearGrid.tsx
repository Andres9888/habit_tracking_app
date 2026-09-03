/**
 * YearGrid — fitted, non-scrolling year so far. Width is measured once and
 * split across the elapsed weeks, so the whole year always fits the card
 * instead of scrolling sideways out of sight.
 */
import { useState } from 'react';
import { Text, View, type LayoutChangeEvent } from 'react-native';
import type { HabitDayContext } from '../../../../features/habits/habitDayState';
import { fontFamilies } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { buildYearCells } from './yearCells';
import { GAP, WeekColumn } from './YearGridWeek';

const LABEL_W = 26;
const ROW_LABELS: Record<number, string> = {
  0: 'Mon',
  2: 'Wed',
  4: 'Fri',
  6: 'Sun',
};

interface YearGridProps {
  completedDates: Set<string>;
  palette: InsightPalette;
  schedule: HabitDayContext;
  today?: string;
  onSelectMonth: (dateString: string) => void;
}

export function YearGrid({
  completedDates,
  palette,
  schedule,
  today,
  onSelectMonth,
}: YearGridProps) {
  const [width, setWidth] = useState(0);
  const { monthLabels, weeks } = buildYearCells({
    completedDates,
    schedule,
    today,
  });
  const cell =
    width > 0
      ? Math.max(
          3,
          Math.floor(
            (width - LABEL_W - GAP * (weeks.length - 1)) / weeks.length
          )
        )
      : 0;
  const onLayout = (event: LayoutChangeEvent) =>
    setWidth(event.nativeEvent.layout.width);

  return (
    <View testID='year-grid' onLayout={onLayout}>
      {cell > 0 ? (
        <View style={{ flexDirection: 'row', gap: GAP }}>
          <View style={{ width: LABEL_W - GAP }}>
            {Array.from({ length: 7 }, (_, row) => (
              <Text
                key={row}
                style={{
                  color: palette.textTertiary,
                  fontFamily: fontFamilies.primary.text,
                  fontSize: 9,
                  height: cell + GAP,
                  lineHeight: cell + GAP,
                }}
              >
                {ROW_LABELS[row] ?? ''}
              </Text>
            ))}
          </View>
          {weeks.map((week, index) => (
            <WeekColumn
              key={index}
              cell={cell}
              palette={palette}
              week={week}
              onPress={onSelectMonth}
            />
          ))}
        </View>
      ) : null}
      <View style={{ height: 14, marginLeft: LABEL_W, marginTop: 6 }}>
        {monthLabels.map((month) => (
          <Text
            key={month.label}
            style={{
              color: palette.textTertiary,
              fontSize: 10,
              left: month.weekIndex * (cell + GAP),
              position: 'absolute',
            }}
          >
            {month.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
