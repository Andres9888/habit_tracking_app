/**
 * CalendarYearSection — the "Year at a glance" half of the calendar card:
 * eyebrow + elapsed-month range, the chromeless year strip, and the trend
 * caption when the months support one.
 *
 * Lives inside CalendarTabContent rather than in its own card so there is
 * exactly one year grid on the History surface, and tapping a cell still jumps
 * the calendar above it.
 */
import { Text, View } from 'react-native';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useInsightPalette } from '../insightPalette';
import { CardEyebrow } from './CardEyebrow';
import { YearStrip } from './YearStrip';

interface CalendarYearSectionProps {
  caption?: string | null;
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
  /** "Jan – Jul", derived from the elapsed months. */
  rangeLabel?: string;
  onNavigateToMonth: (dateString: string) => void;
}

export function CalendarYearSection({
  caption,
  completedDates,
  habitColor,
  habitCreatedAt,
  onNavigateToMonth,
  rangeLabel,
}: CalendarYearSectionProps) {
  const palette = useInsightPalette();

  return (
    <View>
      <View style={{ marginBottom: 10 }}>
        <CardEyebrow
          label='Year at a glance'
          note={rangeLabel}
          palette={palette}
        />
      </View>
      <ErrorBoundary>
        <YearStrip
          completedDates={completedDates}
          habitColor={habitColor}
          habitCreatedAt={habitCreatedAt}
          onNavigateToMonth={onNavigateToMonth}
        />
      </ErrorBoundary>
      {caption ? (
        <Text
          style={{
            borderTopColor: palette.divider,
            borderTopWidth: 1,
            color: palette.textSecondary,
            fontSize: 13,
            lineHeight: 20,
            marginTop: 12,
            paddingTop: 12,
          }}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}
