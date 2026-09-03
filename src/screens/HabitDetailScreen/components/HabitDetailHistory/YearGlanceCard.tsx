/**
 * YearGlanceCard — the "Year at a glance" card from the design's History frame:
 * eyebrow + elapsed-month range, the fitted year grid, and the trend caption
 * when the months actually support one.
 *
 * The grid never scrolls and never toggles: a ~5pt cell is too small to safely
 * write a completion, so pressing a week jumps the month calendar below to it.
 * The old "N days logged" caption is gone on purpose — the rail owns the count.
 */
import { View } from 'react-native';
import type { HabitDayContext } from '../../../../features/habits/habitDayState';
import type { InsightPalette } from '../../insightPalette';
import { CardEyebrow } from '../CardEyebrow';
import { CardFootnote } from '../CardFootnote';
import { InsightCard } from '../InsightCard';
import { YearGrid } from './YearGrid';

interface YearGlanceCardProps {
  caption?: string | null;
  completedDates: Set<string>;
  palette: InsightPalette;
  /** "Jan – Jul", derived from the elapsed months. */
  rangeLabel?: string;
  schedule: HabitDayContext;
  onSelectMonth: (dateString: string) => void;
}

export function YearGlanceCard({
  caption,
  completedDates,
  palette,
  rangeLabel,
  schedule,
  onSelectMonth,
}: YearGlanceCardProps) {
  return (
    <InsightCard palette={palette}>
      <CardEyebrow
        label='Year at a glance'
        note={rangeLabel}
        palette={palette}
      />
      <View style={{ marginTop: 14 }}>
        <YearGrid
          completedDates={completedDates}
          palette={palette}
          schedule={schedule}
          onSelectMonth={onSelectMonth}
        />
      </View>
      {caption ? (
        <CardFootnote palette={palette}>{caption}</CardFootnote>
      ) : null}
    </InsightCard>
  );
}
