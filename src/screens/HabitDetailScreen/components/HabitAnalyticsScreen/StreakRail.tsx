/**
 * StreakRail — Current · Longest · Days logged, with the milestone bar under it.
 *
 * Analytics had no streak data at all, so the one number people quote about
 * themselves was missing from the page that is meant to explain them. The bar
 * turns the record from a fact into a target a few days away.
 */
import { View } from 'react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import type { InsightPalette } from '../../insightPalette';
import { MilestoneBar, WeekStatsRow, type WeekStat } from '../ThisWeekCard';

interface StreakRailProps {
  bestStreak: number;
  currentStreak: number;
  daysLogged: number;
  goalDuration?: number;
  palette: InsightPalette;
}

export function StreakRail({
  bestStreak,
  currentStreak,
  daysLogged,
  goalDuration,
  palette,
}: StreakRailProps) {
  const stats: readonly WeekStat[] = [
    { label: 'Current streak', tint: palette.amberBar, value: currentStreak },
    { label: 'Longest', tint: palette.ctaGreen, value: bestStreak },
    { label: 'Days logged', value: daysLogged },
  ];

  return (
    <View
      style={{
        backgroundColor: palette.card,
        borderColor: palette.cardBorder,
        borderRadius: borderRadius.large,
        borderWidth: 1,
        paddingBottom: 14,
        paddingHorizontal: 18,
        ...shadows.subtle,
      }}
    >
      <WeekStatsRow palette={palette} stats={stats} topBorder={false} />
      <MilestoneBar
        bestStreak={bestStreak}
        currentStreak={currentStreak}
        goalDuration={goalDuration}
        palette={palette}
      />
    </View>
  );
}
