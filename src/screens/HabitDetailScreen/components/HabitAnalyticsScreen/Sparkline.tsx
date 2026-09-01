/**
 * Sparkline — six months of completion rate, one bar each.
 *
 * Bars darken as they improve so the direction is legible without reading a
 * single number; the latest month's label is the only one emphasised.
 */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

const PLOT_HEIGHT = 52;

interface SparklineProps {
  /** Completion rate per month, 0-100, oldest first. */
  bars: readonly number[];
  labels: readonly string[];
  palette: InsightPalette;
}

function barColor(value: number, palette: InsightPalette): string {
  if (value >= 75) return palette.green;
  if (value >= 50) return palette.greenSoft;
  return palette.greenTint;
}

export function Sparkline({ bars, labels, palette }: SparklineProps) {
  const max = Math.max(1, ...bars);

  return (
    <View>
      <View
        style={{
          alignItems: 'flex-end',
          flexDirection: 'row',
          gap: 5,
          height: PLOT_HEIGHT,
          marginTop: 16,
        }}
      >
        {bars.map((value, index) => (
          <View
            key={`${labels[index]}-${index}`}
            style={{
              backgroundColor: barColor(value, palette),
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              flex: 1,
              height: Math.max(3, Math.round((value / max) * PLOT_HEIGHT)),
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 5, marginTop: 6 }}>
        {labels.map((label, index) => (
          <Text
            key={`${label}-${index}`}
            style={{
              color:
                index === labels.length - 1
                  ? palette.textPrimary
                  : palette.textTertiary,
              flex: 1,
              fontFamily: fontFamilies.primary.text,
              fontSize: 11,
              fontWeight:
                index === labels.length - 1
                  ? fontWeights.bold
                  : fontWeights.regular,
              textAlign: 'center',
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
