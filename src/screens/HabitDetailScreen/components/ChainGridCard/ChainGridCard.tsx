/**
 * ChainGridCard — 7-column grid of the last N days as literal chain links.
 * Filled cells = forest-green with inset highlight; end-of-streak days get
 * a burnished-gold ring. A personal-best callout surfaces beneath.
 */
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { useChainCells } from './ChainGridCard.hooks';
import { styles } from './ChainGridCard.styles';
import type { ChainGridCardProps } from './ChainGridCard.types';

const ENTERING = FadeInDown.duration(320).delay(120).springify().damping(18);

function buildCalloutLabel(
  currentStreak: number,
  bestStreak: number
): string | null {
  if (bestStreak <= 0) return null;
  if (currentStreak >= bestStreak) return 'You are at a new personal best.';
  const delta = bestStreak - currentStreak + 1;
  return `${delta} days to beat your personal best`;
}

export function ChainGridCard({
  days,
  currentStreak,
  bestStreak,
}: ChainGridCardProps) {
  const { colors } = useThemeColors();
  const cells = useChainCells(days);
  const callout = buildCalloutLabel(currentStreak, bestStreak);

  return (
    <Animated.View
      entering={ENTERING}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Your chain
        </Text>
        <Text style={[styles.meta, { color: colors.text.secondary }]}>
          Last {days.length} days
        </Text>
      </View>
      <View style={styles.grid} accessibilityLabel='Chain of completed days'>
        {cells.map((cell, index) => (
          <View key={index} style={styles.cellWrapper}>
            <View
              style={[
                styles.cell,
                {
                  backgroundColor: cell.completed
                    ? colors.primary[600]
                    : colors.gray[200],
                },
              ]}
            >
              {cell.completed ? <Text style={styles.checkText}>✓</Text> : null}
            </View>
            {cell.isEndOfStreak ? (
              <View
                style={[styles.cellRing, { borderColor: colors.streak[500] }]}
              />
            ) : null}
          </View>
        ))}
      </View>
      {callout ? (
        <View
          style={[styles.calloutPill, { backgroundColor: colors.primary[100] }]}
        >
          <Text style={{ fontSize: 16 }}>✨</Text>
          <Text style={[styles.calloutText, { color: colors.primary[700] }]}>
            {callout}
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

export default ChainGridCard;
