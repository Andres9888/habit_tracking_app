/**
 * WeekStatsRow — the three-up stat rail used by the Progress card and by the
 * History surface.
 *
 * Composes the shared `ui/StatColumn` + `StatHairline` ("the detail-page stat
 * idiom") rather than reimplementing it. It passes the serif display face for the
 * numerals instead of StatColumn's default monospace, matching this screen's
 * headings.
 *
 * "Days this year" rather than the design's all-time "Days done": the habit's
 * history is only queried year-to-date, so an all-time total would be a guess.
 */
import { View } from 'react-native';
import { StatColumn, StatHairline } from '../../../../components/ui';
import { fontFamilies } from '../../../../theme/typography';
import type { InsightPalette } from '../../insightPalette';

export interface WeekStat {
  label: string;
  value: number;
  /** Rendered smaller and muted after the numeral, e.g. "%". */
  suffix?: string;
  tint?: string;
}

interface WeekStatsRowProps {
  palette: InsightPalette;
  stats: readonly WeekStat[];
  /** The Progress card rules a hairline above the rail; History does not. */
  topBorder?: boolean;
}

export function WeekStatsRow({
  palette,
  stats,
  topBorder = true,
}: WeekStatsRowProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        ...(topBorder
          ? {
              borderTopColor: palette.divider,
              borderTopWidth: 1,
              marginTop: 16,
              paddingTop: 11,
            }
          : { paddingVertical: 11 }),
      }}
    >
      {stats.map((stat, index) => (
        <View key={stat.label} style={{ flexDirection: 'row', flex: 1 }}>
          {index > 0 ? <StatHairline /> : null}
          {/* StatColumn labels its two Texts separately, which a screen reader
              announces as "9" then "Current streak". Grouping restores the one
              coherent announcement the rail had before it composed StatColumn. */}
          {/* Row direction matters: StatColumn's own `flex-1` resolves against
              its parent's main axis. In a column parent it collapsed the
              column to the sibling hairline's 28pt, so the label overflowed
              under the milestone bar below. */}
          <View
            accessible
            accessibilityLabel={`${stat.label}: ${stat.value}${stat.suffix ?? ''}`}
            style={{ flex: 1, flexDirection: 'row' }}
          >
            <StatColumn
              label={stat.label}
              labelColor={palette.textTertiary}
              suffix={stat.suffix}
              value={stat.value}
              valueColor={stat.tint ?? palette.textPrimary}
              valueFontFamily={fontFamilies.primary.display}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
