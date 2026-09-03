/**
 * HistoryStatsCard — the rail that opens the History surface.
 *
 * Current leads: the page used to open on history without ever saying where you
 * stand today, which is the one number people quote about themselves. Current is
 * the run you can lose (amber), Longest the one to beat, then what's banked.
 *
 * The last stat is year-to-date, so for a habit born this year it is the whole
 * record and is dated from creation ("Since Aug 24") — "This year" would imply
 * a longer history the numbers don't have.
 */
import { format } from 'date-fns';
import { View } from 'react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';
import { WeekStatsRow, type WeekStat } from '../ThisWeekCard';

interface HistoryStatsCardProps {
  bestStreak: number;
  /** Habit creation timestamp — dates the "since" label. */
  createdAt?: number;
  currentStreak: number;
  palette: InsightPalette;
  /** True when the habit was created this year — relabels the last stat. */
  sinceStart: boolean;
  yearCompletions: number;
  yearRatePct: number;
}

/** "Since Aug 24" names the day the record starts; "Since start" is the fallback. */
function sinceLabel(createdAt: number | undefined, sinceStart: boolean): string {
  if (!sinceStart) return 'This year';
  if (createdAt === undefined) return 'Since start';
  return `Since ${format(new Date(createdAt), 'MMM d')}`;
}

export function HistoryStatsCard({
  bestStreak,
  createdAt,
  currentStreak,
  palette,
  sinceStart,
  yearCompletions,
  yearRatePct,
}: HistoryStatsCardProps) {
  const stats: readonly WeekStat[] = [
    { label: 'Current', tint: palette.amberBar, value: currentStreak },
    { label: 'Longest', tint: palette.ctaGreen, value: bestStreak },
    { label: 'Days done', value: yearCompletions },
    {
      label: sinceLabel(createdAt, sinceStart),
      suffix: '%',
      value: yearRatePct,
    },
  ];

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        paddingHorizontal: 4,
        paddingVertical: 3,
        ...shadows.subtle,
      }}
    >
      <WeekStatsRow palette={palette} stats={stats} topBorder={false} />
    </View>
  );
}
