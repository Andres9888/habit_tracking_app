import { Text, View } from 'react-native';
import { useInsightPalette } from '../../insightPalette';
import { CardEyebrow } from '../CardEyebrow';
import { InsightCard } from '../InsightCard';
import type { WeekBar } from './weeklyBars';

interface RangeChartProps {
  bars: WeekBar[];
  subtitle: string;
  title: string;
}

export function RangeChart({ bars, subtitle, title }: RangeChartProps) {
  const palette = useInsightPalette();
  const max = Math.max(1, ...bars.map((bar) => bar.value));

  return (
    <InsightCard palette={palette}>
      <CardEyebrow label={title} note={subtitle} palette={palette} />
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
        Based on days you logged. A week with no check-ins shows as zero —
        nothing is estimated or filled in for you.
      </Text>
    </InsightCard>
  );
}
