/**
 * HistoryStatsCard — the three-up rail that opens the History surface:
 * days done, this year's rate, and the best streak on record.
 */
import { View } from 'react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';
import { WeekStatsRow, type WeekStat } from '../ThisWeekCard';

interface HistoryStatsCardProps {
  bestStreak: number;
  palette: InsightPalette;
  yearCompletions: number;
  yearRatePct: number;
}

export function HistoryStatsCard({
  bestStreak,
  palette,
  yearCompletions,
  yearRatePct,
}: HistoryStatsCardProps) {
  const stats: readonly WeekStat[] = [
    { label: 'Days done', value: yearCompletions },
    { label: 'This year', suffix: '%', value: yearRatePct },
    { label: 'Best streak', value: bestStreak },
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
