/** QuickStatsRow - Compact pill badges: current streak, best streak, total days */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { borderRadius } from '../../../theme/spacing';
import { fontFamilies } from '../../../theme/typography';

interface QuickStatsRowProps {
  bestStreak: number;
  currentStreak: number;
  totalCompletions: number;
}

const ENTERING = FadeInUp.duration(280).delay(120).springify().damping(18);

function StatPill({
  emoji,
  isActive,
  label,
  value,
}: {
  emoji: string;
  isActive?: boolean;
  label: string;
  value: number;
}) {
  return (
    <View
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.pill, isActive ? styles.activePill : styles.inactivePill]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color: isActive ? '#047857' : '#6B6560' }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: isActive ? '#059669' : '#9C958D' }]}>
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
  return (
    <Animated.View entering={ENTERING} style={styles.row}>
      <StatPill isActive emoji='🔥' label='current' value={currentStreak} />
      <StatPill emoji='⭐' label='best' value={bestStreak} />
      <StatPill emoji='📅' label='total' value={totalCompletions} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  activePill: {
    backgroundColor: '#ecfdf5',
  },
  emoji: {
    fontSize: 12,
  },
  inactivePill: {
    backgroundColor: '#F5F0EB',
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
