/** HeatmapLegend — missed → done ramp, plus the today marker. */
import { Text, View } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';

const SWATCH = 12;

interface HeatmapLegendProps {
  palette: InsightPalette;
}

function swatch(style: object, key: string) {
  return (
    <View
      key={key}
      style={{
        borderRadius: borderRadius.small - 4,
        height: SWATCH,
        width: SWATCH,
        ...style,
      }}
    />
  );
}

export function HeatmapLegend({ palette }: HeatmapLegendProps) {
  const label = { color: palette.textTertiary, fontSize: 11 };

  return (
    <View
      accessibilityLabel='Legend: darker cells mean done, pale cells mean missed, outlined cell is today'
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
      }}
    >
      <Text style={label}>Missed</Text>
      {swatch({ backgroundColor: palette.cellEmpty }, 'missed')}
      {swatch({ backgroundColor: palette.greenSoft }, 'skipped')}
      {swatch({ backgroundColor: palette.green }, 'done')}
      <Text style={label}>Done</Text>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 6,
          marginLeft: 'auto',
        }}
      >
        {swatch({ borderColor: palette.ctaGreen, borderWidth: 2 }, 'today')}
        <Text style={label}>Today</Text>
      </View>
    </View>
  );
}
