/**
 * SwipeGripLines Component
 * Subtle grip lines on the trailing edge of HabitCard to hint swipe-to-delete.
 * Theme-aware: adapts to dark mode.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

const GRIP_LINE_COUNT = 3;

export function SwipeGripLines() {
  const { colors } = useThemeColors();
  const lineColor = colors.text?.tertiary ?? 'rgba(0, 0, 0, 0.10)';

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={gripStyles.container}
    >
      {Array.from({ length: GRIP_LINE_COUNT }).map((_, i) => (
        <View
          key={i}
          style={[gripStyles.line, { backgroundColor: lineColor, opacity: 0.3 }]}
        />
      ))}
    </View>
  );
}

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
