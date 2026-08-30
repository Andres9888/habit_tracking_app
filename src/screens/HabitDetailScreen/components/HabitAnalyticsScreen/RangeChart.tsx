import { useInsightPalette } from '../../insightPalette';
import { CardFootnote } from '../CardFootnote';
import { ChartHead } from '../ChartHead';
import { InsightCard } from '../InsightCard';
import { ChartPlot } from './ChartPlot';
import type { WeekBar } from './weeklyBars';

interface RangeChartProps {
  /** "avg 5.1" or "avg 78%" — the units belong to the caller. */
  averageLabel: string;
  bars: WeekBar[];
  footnote: string;
  /** Percent charts scale to 100 so a 31-day month doesn't dwarf a 28-day one. */
  scaleMax?: number;
  subtitle: string;
  title: string;
}

export function RangeChart({
  averageLabel,
  bars,
  footnote,
  scaleMax,
  subtitle,
  title,
}: RangeChartProps) {
  const palette = useInsightPalette();
  const values = bars.map((bar) => bar.value);
  const max = Math.max(1, scaleMax ?? Math.max(0, ...values));
  const average =
    values.length === 0
      ? 0
      : values.reduce((sum, value) => sum + value, 0) / values.length;
  const best = Math.max(0, ...values);
  // Ties go to the most recent bar: the takeaway should be current.
  const bestIndex = best === 0 ? -1 : values.lastIndexOf(best);

  return (
    <InsightCard palette={palette}>
      <ChartHead palette={palette} subtitle={subtitle} title={title} />
      <ChartPlot
        average={average}
        averageLabel={averageLabel}
        bars={bars}
        bestIndex={bestIndex}
        max={max}
        palette={palette}
      />
      <CardFootnote palette={palette}>{footnote}</CardFootnote>
    </InsightCard>
  );
}
