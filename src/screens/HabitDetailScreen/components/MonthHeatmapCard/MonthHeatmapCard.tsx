/**
 * MonthHeatmapCard — "Your month": a rolling four-week heatmap, its legend, and
 * a footer with the year-to-date count plus a route into the full history.
 */
import { Text, View } from 'react-native';
import { useInsightPalette } from '../../insightPalette';
import { CardEyebrow } from '../CardEyebrow';
import { InsightPill } from '../NoticingSection/InsightPill';
import { HeatmapGrid } from './HeatmapGrid';
import { HeatmapLegend } from './HeatmapLegend';
import { useMonthHeatmap } from './useMonthHeatmap';
import { InsightCard } from '../InsightCard';

interface MonthHeatmapCardProps {
  completedDates: Set<string>;
  daysOfWeek?: number[];
  /** Share of elapsed scheduled days completed this year, 0-100. */
  yearRatePct: number;
  onDayPress: (date: string, isCompleted: boolean) => void;
  onViewHistory: () => void;
}

export function MonthHeatmapCard({
  completedDates,
  daysOfWeek,
  onDayPress,
  onViewHistory,
  yearRatePct,
}: MonthHeatmapCardProps) {
  const palette = useInsightPalette();
  const { cells, rangeLabel } = useMonthHeatmap({ completedDates, daysOfWeek });

  return (
    <InsightCard palette={palette}>
      <CardEyebrow label='Your month' note={rangeLabel} palette={palette} />

      <HeatmapGrid cells={cells} palette={palette} onDayPress={onDayPress} />
      <HeatmapLegend palette={palette} />

      <View
        style={{
          alignItems: 'center',
          borderTopColor: palette.divider,
          borderTopWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 15,
          paddingTop: 14,
        }}
      >
        <Text style={{ color: palette.textSecondary, fontSize: 13 }}>
          {yearRatePct}% of days this year
        </Text>
        <InsightPill
          accessibilityHint='Opens the full calendar history for this habit'
          borderColor={palette.greenTint}
          label='View history ›'
          tint={palette.ctaGreen}
          onPress={onViewHistory}
        />
      </View>
    </InsightCard>
  );
}
