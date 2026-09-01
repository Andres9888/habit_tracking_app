/**
 * StreakRunRow — one run in "Your runs": its length, a proportional bar, and
 * the dates it covers. The goal row reuses it with a dashed, unfilled track.
 */
import { Text, View } from 'react-native';
import { fontFamilies, fontWeights } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

interface StreakRunRowProps {
  /** Star or similar marker drawn inside the track, after the fill. */
  badge?: string;
  /** The goal row draws an outline instead of a fill. */
  dashed?: boolean;
  fill?: string;
  meta: string;
  numeral: number;
  numeralColor: string;
  palette: InsightPalette;
  /** Share of the axis, 0-100. */
  pct: number;
  track: string;
  unit: string;
}

export function StreakRunRow({
  badge,
  dashed = false,
  fill,
  meta,
  numeral,
  numeralColor,
  palette,
  pct,
  track,
  unit,
}: StreakRunRowProps) {
  return (
    <View
      accessible
      accessibilityLabel={`${numeral} ${unit}, ${meta}`}
      style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}
    >
      <View style={{ flexDirection: 'row', width: 62 }}>
        <Text
          style={{
            color: numeralColor,
            flex: 1,
            fontFamily: fontFamilies.primary.display,
            fontSize: 19,
            fontWeight: fontWeights.bold,
            textAlign: 'right',
          }}
        >
          {numeral}
          <Text
            style={{
              color: palette.textTertiary,
              fontFamily: fontFamilies.primary.text,
              fontSize: 12,
              fontWeight: fontWeights.regular,
            }}
          >
            {` ${unit}`}
          </Text>
        </Text>
      </View>
      <View
        style={{
          backgroundColor: dashed ? 'transparent' : track,
          borderColor: dashed ? palette.amberBorder : 'transparent',
          borderRadius: 7,
          borderStyle: dashed ? 'dashed' : 'solid',
          borderWidth: dashed ? 1.5 : 0,
          flex: 1,
          flexDirection: 'row',
          height: 22,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            backgroundColor: fill ?? 'transparent',
            width: `${Math.max(0, Math.min(100, pct))}%`,
          }}
        />
        {badge ? (
          <Text
            style={{
              alignSelf: 'center',
              color: palette.ctaGreen,
              fontFamily: fontFamilies.primary.text,
              fontSize: 11,
              fontWeight: fontWeights.bold,
              marginLeft: 8,
            }}
          >
            {badge}
          </Text>
        ) : null}
      </View>
      <Text
        style={{
          color: palette.textSecondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 12,
          width: 82,
        }}
      >
        {meta}
      </Text>
    </View>
  );
}
