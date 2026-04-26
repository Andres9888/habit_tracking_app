import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';
import {
  LEVEL_COLORS,
  LEVEL_LABELS,
  STRENGTH_LEVELS,
} from '../StrengthDistributionChart.constants';
import type { StrengthDistributionData } from '../StrengthDistributionChart.types';

interface LegendProps {
  data: StrengthDistributionData;
  onSegmentPress?: (level: string) => void;
}

export function Legend({ data, onSegmentPress }: LegendProps) {
  return (
    <View style={styles.legend}>
      {STRENGTH_LEVELS.filter((level) => data[level].count > 0).map((level) => {
        const levelData = data[level];
        return (
          <Pressable
            key={level}
            accessibilityLabel={`${LEVEL_LABELS[level]}: ${levelData.percentage.toFixed(0)}%, ${levelData.count} habits`}
            accessibilityRole='button'
            style={({ pressed }) => [
              styles.legendItem,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => onSegmentPress?.(level)}
          >
            <View style={styles.legendRow}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: LEVEL_COLORS[level] },
                ]}
              />
              <Text style={styles.legendEmoji}>{levelData.emoji}</Text>
              <Text style={styles.legendLabel}>{LEVEL_LABELS[level]}</Text>
            </View>
            <Text style={styles.legendValue}>
              {levelData.percentage.toFixed(0)}%
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    marginTop: spacing.lg,
    width: '100%',
  },
  legendDot: {
    borderRadius: borderRadius.small,
    height: 12,
    marginRight: spacing.sm,
    width: 12,
  },
  legendEmoji: {
    fontSize: typography.body.fontSize,
    marginRight: spacing.xs,
  },
  legendItem: {
    alignItems: 'center',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  legendLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  legendValue: {
    ...typography.bodyBold,
    color: colors.text.secondary,
  },
});
