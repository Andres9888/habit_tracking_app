/**
 * SwipeGripLines Component
 * Subtle grip lines on the trailing edge of HabitCard to hint swipe-to-delete.
 * Theme-aware: adapts to dark mode.
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

const GRIP_LINE_COUNT = 3;
const GRIP_LINE_KEYS = Array.from({ length: GRIP_LINE_COUNT }, (_, i) => i);

export const SwipeGripLines = memo(function SwipeGripLines() {
  const { colors } = useThemeColors();
  const gripColor = colors.text?.tertiary ?? 'rgba(0, 0, 0, 0.10)';

  const gripLineStyle = useMemo(
    () => [gripStyles.line, { backgroundColor: gripColor, opacity: 0.3 }],
    [gripColor]
  );

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={gripStyles.container}
    >
      {GRIP_LINE_KEYS.map((i) => (
        <View key={i} style={gripLineStyle} />
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
