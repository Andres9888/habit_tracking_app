/** QuickStatsRow - Stats card with 3 equal columns: streak, best streak, completions */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';

interface QuickStatsRowProps {
  bestStreak: number;
  currentStreak: number;
  totalCompletions: number;
}

const ENTERING = FadeInUp.duration(280).delay(120).springify().damping(18);

interface StatColumnProps {
  activeBg: string;
  activeColor: string;
  defaultColor: string;
  emoji: string;
  isActive?: boolean;
  label: string;
  labelColor: string;
  value: number;
}

function StatColumn({ emoji, isActive, label, activeColor, activeBg, defaultColor, labelColor, value }: StatColumnProps) {
  return (
    <View accessibilityLabel={`${label}: ${value}`} style={styles.column}>
      <View style={[styles.emojiWrap, isActive && { backgroundColor: activeBg }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.value, { color: isActive ? activeColor : defaultColor }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </View>
  );
}

export const QuickStatsRow = memo(function QuickStatsRow({
  bestStreak,
  currentStreak,
  totalCompletions,
}: QuickStatsRowProps) {
  const { colors } = useThemeColors();
  const columnColors = {
    activeBg: colors.status.successLight,
    activeColor: colors.status.successText,
    defaultColor: colors.text.primary,
    labelColor: colors.text.tertiary,
  };

  return (
    <Animated.View
      entering={ENTERING}
      style={[styles.card, { backgroundColor: colors.card }]}
    >
      <StatColumn isActive emoji='🔥' label='streak' value={currentStreak} {...columnColors} />
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
      <StatColumn emoji='⭐' label='best streak' value={bestStreak} {...columnColors} />
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
      <StatColumn emoji='📅' label='completions' value={totalCompletions} {...columnColors} />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    marginTop: spacing.sm,
    ...shadows.card,
  },
  column: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  emoji: { fontSize: 18 },
  emojiWrap: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 30,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: 30,
  },
  label: {
    ...typography.tabBar,
    fontWeight: fontWeights.medium,
  },
  separator: { height: 32, width: 1 },
  value: {
    ...typography.heading3,
    fontFamily: fontFamilies.monospace,
    fontWeight: fontWeights.bold,
  },
});
