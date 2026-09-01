/**
 * ChartAverageLine — the dashed baseline across the plot.
 *
 * A bar is meaningless without something to compare it to; this is what makes
 * the chart interpretable instead of decorative. The label sits on the card
 * fill so it stays legible where it crosses a bar.
 */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface ChartAverageLineProps {
  /** Distance from the plot floor, in points. */
  bottom: number;
  label: string;
  palette: InsightPalette;
}

export function ChartAverageLine({
  bottom,
  label,
  palette,
}: ChartAverageLineProps) {
  return (
    <View
      pointerEvents='none'
      style={{
        borderStyle: 'dashed',
        borderTopColor: palette.missedRing,
        borderTopWidth: 1.5,
        bottom,
        left: 0,
        position: 'absolute',
        right: 0,
      }}
    >
      <Text
        style={{
          alignSelf: 'flex-end',
          backgroundColor: palette.card,
          color: palette.textTertiary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 11,
          fontWeight: fontWeights.semibold,
          marginTop: -14,
          paddingHorizontal: 4,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
