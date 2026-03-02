/**
 * QuickStatsRow - Streak, best ever, completion rate, total completions
 *
 * Surfaces data already computed in useHabitDetailScreenState
 * that was previously never rendered to users.
 */

import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { borderRadius, shadows } from '../../../theme/spacing';
import { fontFamilies } from '../../../theme/typography';

interface QuickStatsRowProps {
  bestStreak: number;
  currentStreak: number;
  daysTracking: number;
  totalCompletions: number;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

function StatChip({
  delay,
  label,
  prefix,
  value,
}: {
  delay: number;
  label: string;
  prefix?: string;
  value: number | string;
}) {
  const { colors, isDark } = useThemeColors();

  return (
    <Animated.View
      accessibilityLabel={`${label}: ${value}`}
      entering={anim(delay)}
      style={[
        styles.chip,
        {
          backgroundColor: isDark ? colors.card : '#FFFFFF',
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.value, { color: colors.text.primary }]}>
        {prefix}
        {value}
      </Text>
      <Text style={[styles.label, { color: colors.text.tertiary }]}>
        {label}
      </Text>
    </Animated.View>
  );
}

export const QuickStatsRow = memo(function QuickStatsRow({
  bestStreak,
  currentStreak,
  daysTracking,
  totalCompletions,
}: QuickStatsRowProps) {
  const rate = useMemo(() => {
    if (daysTracking === 0) return '—';
    return `${Math.round((totalCompletions / daysTracking) * 100)}%`;
  }, [daysTracking, totalCompletions]);

  return (
    <View style={styles.row}>
      <StatChip delay={120} label="Streak" prefix="🔥 " value={currentStreak} />
      <StatChip delay={160} label="Best" prefix="⭐ " value={bestStreak} />
      <StatChip delay={200} label="Rate" value={rate} />
      <StatChip delay={240} label="Total" value={totalCompletions} />
    </View>
  );
});

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 10,
    ...shadows.subtle,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  value: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
});
