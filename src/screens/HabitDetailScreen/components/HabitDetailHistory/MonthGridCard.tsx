/**
 * MonthGridCard — one completed month at a glance: serif month name, its
 * completion rate, and a Monday-first grid of plain cells.
 *
 * The design pairs this with the current month; here it shows the last COMPLETE
 * month only, because the interactive calendar below already renders the current
 * one and two grids of the same month on one screen reads as a bug.
 */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { MonthRate } from '../../insights';
import type { InsightPalette } from '../../insightPalette';
import { buildMonthCells, monthCellColor } from './monthCells';
import { InsightCard } from '../InsightCard';

interface MonthGridCardProps {
  completedDates: Set<string>;
  daysOfWeek?: number[];
  isBest: boolean;
  palette: InsightPalette;
  rate: MonthRate;
  year: number;
}

export function MonthGridCard({
  completedDates,
  daysOfWeek,
  isBest,
  palette,
  rate,
  year,
}: MonthGridCardProps) {
  const cells = buildMonthCells({
    completedDates,
    daysOfWeek,
    month: rate.month,
    year,
  });

  return (
    <InsightCard palette={palette}>
      <View
        style={{
          alignItems: 'baseline',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            color: palette.textPrimary,
            fontFamily: fontFamilies.primary.display,
            fontSize: 18,
            fontWeight: fontWeights.semibold,
          }}
        >
          {rate.label}
        </Text>
        <Text
          style={{
            color: palette.ctaGreen,
            fontSize: 12,
            fontWeight: fontWeights.semibold,
          }}
        >
          {rate.ratePct}%{isBest ? ' · best month ★' : ''}
        </Text>
      </View>
      <View
        accessibilityLabel={`${rate.label}: ${rate.done} of ${rate.scheduled} days`}
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: -3,
          marginTop: 9,
        }}
      >
        {cells.map((cell, index) => (
          <View
            key={cell?.date ?? `blank-${index}`}
            // Exactly seven per row: 1/7 of the width, with padding as the gap.
            style={{ flexBasis: '14.2857%', padding: 3 }}
          >
            <View
              style={{
                aspectRatio: 1,
                backgroundColor: cell
                  ? monthCellColor(cell.state, palette)
                  : 'transparent',
                borderRadius: borderRadius.small,
              }}
            />
          </View>
        ))}
      </View>
    </InsightCard>
  );
}
