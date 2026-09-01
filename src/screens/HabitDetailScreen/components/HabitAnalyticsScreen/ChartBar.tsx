/**
 * ChartBar — one bar in the range chart. The best bar carries the full green
 * so the chart has a takeaway; the rest sit back at half strength. A partial
 * period (this week, this month) is dimmed rather than hidden.
 */
import { Text, View } from 'react-native';
import type { InsightPalette } from '../../insightPalette';
import type { WeekBar } from './weeklyBars';
import { fontFamilies } from '../../../../theme/typography';

interface ChartBarProps {
  bar: WeekBar;
  /** Tallest drawable height, leaving headroom for the percent caption. */
  barMax: number;
  isBest: boolean;
  max: number;
  palette: InsightPalette;
}

export function ChartBar({ bar, barMax, isBest, max, palette }: ChartBarProps) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      {bar.valueCaption ? (
        <Text
          style={{
            color: palette.textTertiary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 11,
            marginBottom: 4,
          }}
        >
          {bar.valueCaption}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: isBest ? palette.green : palette.greenSoft,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          height: Math.max(4, Math.round((bar.value / max) * barMax)),
          opacity: bar.partial ? 0.45 : 1,
          width: '70%',
        }}
      />
    </View>
  );
}
