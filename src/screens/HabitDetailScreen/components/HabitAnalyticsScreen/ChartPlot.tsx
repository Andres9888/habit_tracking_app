/**
 * ChartPlot — the bars, the baseline that makes them readable, and the axis
 * labels underneath. The best period's label is emphasised so the chart names
 * its own takeaway.
 */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';
import { ChartAverageLine } from './ChartAverageLine';
import { ChartBar } from './ChartBar';
import type { WeekBar } from './weeklyBars';

const PLOT_HEIGHT = 104;
/** Headroom above the tallest bar for the monthly percent captions. */
const BAR_MAX = 88;

interface ChartPlotProps {
  average: number;
  averageLabel: string;
  bars: WeekBar[];
  bestIndex: number;
  max: number;
  palette: InsightPalette;
}

export function ChartPlot({
  average,
  averageLabel,
  bars,
  bestIndex,
  max,
  palette,
}: ChartPlotProps) {
  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ height: PLOT_HEIGHT }}>
        <View
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            gap: 7,
            height: PLOT_HEIGHT,
          }}
        >
          {bars.map((bar, index) => (
            <ChartBar
              key={bar.label}
              bar={bar}
              barMax={BAR_MAX}
              isBest={index === bestIndex}
              max={max}
              palette={palette}
            />
          ))}
        </View>
        <ChartAverageLine
          bottom={Math.round((average / max) * BAR_MAX)}
          label={averageLabel}
          palette={palette}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 7, marginTop: 7 }}>
        {bars.map((bar, index) => (
          <Text
            key={bar.label}
            style={{
              color:
                index === bestIndex
                  ? palette.textPrimary
                  : palette.textTertiary,
              flex: 1,
              fontFamily: fontFamilies.primary.text,
              fontSize: 11,
              fontWeight:
                index === bestIndex ? fontWeights.bold : fontWeights.regular,
              textAlign: 'center',
            }}
          >
            {bar.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
