/** QuickStatsRow - Compact pill badges: current streak, best streak, total days */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { borderRadius } from '../../../theme/spacing';
import { fontFamilies } from '../../../theme/typography';

interface QuickStatsRowProps {
  bestStreak: number;
  currentStreak: number;
  totalCompletions: number;
}

const ENTERING = FadeInUp.duration(280).delay(120).springify().damping(18);

function StatPill({
  activeBg,
  activeText,
  activeLabel,
  emoji,
  inactiveBg,
  inactiveText,
  inactiveLabel,
  isActive,
  label,
  value,
}: {
  activeBg: string;
  activeText: string;
  activeLabel: string;
  emoji: string;
  inactiveBg: string;
  inactiveText: string;
  inactiveLabel: string;
  isActive?: boolean;
  label: string;
  value: number;
}) {
  return (
    <View
      accessibilityLabel={`${label}: ${value}`}
      style={[
        styles.pill,
        { backgroundColor: isActive ? activeBg : inactiveBg },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color: isActive ? activeText : inactiveText }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: isActive ? activeLabel : inactiveLabel }]}>
        {label}
      </Text>
    </View>
  );
}

export const QuickStatsRow = memo(function QuickStatsRow({
  bestStreak,
  currentStreak,
  totalCompletions,
}: QuickStatsRowProps) {
  const { colors } = useThemeColors();
  const pillColors = {
    activeBg: colors.status.successLight,
    activeLabel: colors.status.success,
    activeText: colors.status.successText,
    inactiveBg: colors.card,
    inactiveLabel: colors.text.tertiary,
    inactiveText: colors.text.secondary,
  };

  return (
    <Animated.View entering={ENTERING} style={styles.row}>
      <StatPill isActive emoji='🔥' label='streak' value={currentStreak} {...pillColors} />
      <StatPill emoji='⭐' label='best streak' value={bestStreak} {...pillColors} />
      <StatPill emoji='📅' label='completions' value={totalCompletions} {...pillColors} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  emoji: {
    fontSize: 12,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 11,
  },
  pill: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  value: {
    fontFamily: fontFamilies.monospace,
    fontSize: 13,
    fontWeight: '700',
  },
});
