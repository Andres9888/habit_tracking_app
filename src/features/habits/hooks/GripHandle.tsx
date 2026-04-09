/**
 * GripHandle — visual drag affordance shown when reorder mode is active.
 *
 * Renders three short horizontal bars (grip dots pattern) centered above
 * the habit card. Fades in with a spring animation when reorder mode activates.
 *
 * Supports dark mode via `useThemeColors`.
 */

import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';

function GripHandleComponent() {
  const { isDark } = useThemeColors();
  const barColor = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.18)';

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={styles.container}
    >
      <View style={[styles.bar, { backgroundColor: barColor }]} />
      <View style={[styles.bar, { backgroundColor: barColor }]} />
      <View style={[styles.bar, { backgroundColor: barColor }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 4,
    height: 3,
    marginVertical: 2,
    width: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    paddingTop: 4,
  },
});

export const GripHandle = memo(GripHandleComponent);
