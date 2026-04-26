/**
 * CompactHero — merged hero + metrics for tight layouts.
 * Small ring on left; on right: N/goal + "N to go", progress bar,
 * and completion rate + best streak.
 */
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { SmallRing } from './SmallRing';
import { createCompactStyles } from './styles/compact.styles';

interface CompactHeroProps {
  currentStreak: number;
  streakGoal: number;
  daysRemaining: number;
  overallPercent: number;
  completionRate: number;
  bestStreak: number;
}

export const CompactHero = React.memo(function CompactHero({
  currentStreak,
  streakGoal,
  daysRemaining,
  overallPercent,
  completionRate,
  bestStreak,
}: CompactHeroProps) {
  const { colors } = useThemeColors();
  const s = useMemo(() => createCompactStyles(colors), [colors]);
  const rate = Math.max(0, Math.min(100, Math.round(completionRate)));
  const fillPercent = Math.max(0, Math.min(100, overallPercent));

  return (
    <View style={s.heroCard}>
      <View style={s.heroRow}>
        <SmallRing percent={overallPercent} />

        <View style={s.heroRight}>
          <View style={s.heroStat}>
            <Text style={s.heroStatValue}>
              {currentStreak}{' '}
              <Text style={s.heroStatDenom}>/ {streakGoal}</Text>
            </Text>
            <Text style={s.heroRemaining}>{daysRemaining} to go</Text>
          </View>

          <View style={s.heroProgressBar}>
            <View style={[s.heroProgressFill, { width: `${fillPercent}%` }]} />
          </View>

          <View style={s.heroMetaRow}>
            <Text style={s.heroMetaText}>{rate}% rate</Text>
            <Text style={s.heroMetaText}>best: {bestStreak}d</Text>
          </View>
        </View>
      </View>
    </View>
  );
});
