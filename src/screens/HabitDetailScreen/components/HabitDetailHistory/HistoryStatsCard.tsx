/**
 * HistoryStatsCard — the rail that opens the History surface.
 *
 * Current leads: the page used to open on history without ever saying where you
 * stand today, which is the one number people quote about themselves. Current is
 * the run you can lose (amber), Longest the one to beat, then what's banked.
 */
import { View } from 'react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';
import { WeekStatsRow, type WeekStat } from '../ThisWeekCard';

interface HistoryStatsCardProps {
  bestStreak: number;
  currentStreak: number;
  palette: InsightPalette;
  yearCompletions: number;
  yearRatePct: number;
}

export function HistoryStatsCard({
  bestStreak,
  currentStreak,
  palette,
  yearCompletions,
  yearRatePct,
}: HistoryStatsCardProps) {
  const stats: readonly WeekStat[] = [
    { label: 'Current', tint: palette.amberBar, value: currentStreak },
    { label: 'Longest', tint: palette.ctaGreen, value: bestStreak },
    { label: 'Days done', value: yearCompletions },
    { label: 'This year', suffix: '%', value: yearRatePct },
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
