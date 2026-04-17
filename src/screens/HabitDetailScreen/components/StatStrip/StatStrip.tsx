/**
 * StatStrip — three-cell display for current streak, strength %, personal best.
 * Uses displayLarge Literata + tabular-nums. Streak=gold, strength=primary,
 * best=neutral. Divider between cells. Part of chain-as-hero detail layout.
 */
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { styles } from './StatStrip.styles';
import type { StatStripProps } from './StatStrip.types';

const ENTERING = FadeInDown.duration(280).delay(80).springify().damping(18);

export function StatStrip({
  currentStreak,
  strength,
  bestStreak,
}: StatStripProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      accessibilityLabel={`Current streak ${currentStreak} days. Strength ${strength} percent. Personal best ${bestStreak} days.`}
      entering={ENTERING}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.cell}>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: colors.streak[700] }]}>
            {currentStreak}
          </Text>
          <Text style={styles.valueSuffix}>🔥</Text>
        </View>
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          Current streak
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.cell}>
        <Text style={[styles.value, { color: colors.primary[700] }]}>
          {strength}%
        </Text>
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          Automatic
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.cell}>
        <Text style={[styles.value, { color: colors.text.primary }]}>
          {bestStreak}
        </Text>
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          Personal best
        </Text>
      </View>
    </Animated.View>
  );
}

export default StatStrip;
