import { Text, View } from 'react-native';
import { useInsightPalette } from '../../insightPalette';
import { ChartHead } from '../ChartHead';
import { InsightCard } from '../InsightCard';
import type { WeekBar } from './weeklyBars';

interface RangeChartProps {
  bars: WeekBar[];
  footnote: string;
  /** Percent charts scale to 100 so a 31-day month doesn't dwarf a 28-day one. */
  scaleMax?: number;
  subtitle: string;
  title: string;
}

export function RangeChart({
  bars,
  footnote,
  scaleMax,
  subtitle,
  title,
}: RangeChartProps) {
  const palette = useInsightPalette();
  const max = Math.max(
    1,
    scaleMax ?? Math.max(0, ...bars.map((bar) => bar.value))
  );

  return (
    <InsightCard palette={palette}>
      <ChartHead palette={palette} subtitle={subtitle} title={title} />
      <View
        style={{
          alignItems: 'flex-end',
          flexDirection: 'row',
          gap: 6,
          height: 120,
          marginTop: 14,
        }}
      >
        {bars.map((bar) => (
          <View key={bar.label} style={{ alignItems: 'center', flex: 1 }}>
            {bar.valueCaption ? (
              <Text
                style={{
                  color: palette.textTertiary,
                  fontSize: 10,
                  marginBottom: 4,
                }}
              >
                {bar.valueCaption}
              </Text>
            ) : null}
            <View
              style={{
                backgroundColor: palette.green,
                borderRadius: 4,
                height: Math.max(4, Math.round((bar.value / max) * 100)),
                opacity: bar.partial ? 0.45 : 1,
                width: '70%',
              }}
            />
            <Text
              style={{
                color: palette.textTertiary,
                fontSize: 10,
                marginTop: 6,
              }}
            >
              {bar.label}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          color: palette.textSecondary,
          fontSize: 13,
          lineHeight: 19,
          marginTop: 12,
        }}
      >
        {footnote}
      </Text>
    </InsightCard>
  );
}
