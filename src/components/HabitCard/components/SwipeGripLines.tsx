/**
 * SwipeGripLines Component
 * Subtle grip lines on the trailing edge of HabitCard to hint swipe-to-delete.
 * Three thin vertical lines that subtly pulse on first render.
 *
 * FIXED: Use theme-aware color so grip lines are visible in dark mode.
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

const GRIP_LINE_COUNT = 3;

export const SwipeGripLines = memo(function SwipeGripLines() {
  const { colors: themeColors } = useThemeColors();
  // Use theme text tertiary with low opacity for grip lines
  const gripColor = themeColors.text?.tertiary
    ? themeColors.text.tertiary + '30'
    : 'rgba(0, 0, 0, 0.18)';

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={gripStyles.container}
    >
      {Array.from({ length: GRIP_LINE_COUNT }).map((_, i) => (
        <View key={i} style={[gripStyles.line, { backgroundColor: gripColor }]} />
      ))}
    </View>
  );
});

const gripStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2.5,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
  line: {
    borderRadius: 1,
    height: 20,
    width: 2,
  },
});
