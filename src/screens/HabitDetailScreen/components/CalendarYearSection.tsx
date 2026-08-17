/**
 * CalendarYearSection — "Year at a glance" title, year strip, and caption.
 */
import { Text, View } from 'react-native';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useInsightPalette } from '../insightPalette';
import { ChartHead } from './ChartHead';
import { YearStrip } from './YearStrip';

interface CalendarYearSectionProps {
  caption?: string | null;
  completedDates: Set<string>;
  habitColor: string;
  habitCreatedAt?: number;
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
      <ChartHead
        palette={palette}
        subtitle={rangeLabel}
        title='Year at a glance'
      />
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
