/**
 * YearGlanceCard — the "Year at a glance" card from the design's History frame:
 * eyebrow + elapsed-month range, the year grid with its month labels, and the
 * trend caption when the months actually support one.
 *
 * This is the frame's own card. The interactive month calendar it used to sit
 * inside belongs to the pre-redesign screen and now lives behind the "Calendar,
 * strength and goal" disclosure, so History reads as the design draws it.
 *
 * Cells INSPECT only here — there is no calendar above them to jump, and a ~6px
 * cell is too small to safely write a completion.
 */
import { View } from 'react-native';
import type { InsightPalette } from '../../insightPalette';
import { CalendarYearSection } from '../CalendarYearSection';
import { InsightCard } from '../InsightCard';
import { useCalendarAppearance } from '../useCalendarAppearance';

const NOOP_MONTH = (_dateString: string) => {};

interface YearGlanceCardProps {
  caption?: string | null;
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  palette: InsightPalette;
  /** "Jan – Jul", derived from the elapsed months. */
  rangeLabel?: string;
  onNavigateToMonth?: (dateString: string) => void;
}

export function YearGlanceCard({
  caption,
  completedDates,
  habitColor,
  habitCreatedAt,
  palette,
  rangeLabel,
  onNavigateToMonth,
}: YearGlanceCardProps) {
  const { dayShape } = useCalendarAppearance();

  return (
    <InsightCard palette={palette}>
      <View>
        <CalendarYearSection
          caption={caption}
          completedDates={completedDates}
          dayShape={dayShape}
          habitColor={habitColor}
          habitCreatedAt={habitCreatedAt}
          rangeLabel={rangeLabel}
          onNavigateToMonth={onNavigateToMonth ?? NOOP_MONTH}
        />
      </View>
    </InsightCard>
  );
}
