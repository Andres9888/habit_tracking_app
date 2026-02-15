/**
 * SwipeGripLines Component
 * Subtle grip lines on the trailing edge of HabitCard to hint swipe-to-delete.
 * Three thin vertical lines that subtly pulse on first render.
 */

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const GRIP_LINE_COUNT = 3;
const GRIP_LINE_COLOR = 'rgba(0, 0, 0, 0.18)';

export const SwipeGripLines = memo(function SwipeGripLines() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={gripStyles.container}
    >
      {Array.from({ length: GRIP_LINE_COUNT }).map((_, i) => (
        <View key={i} style={gripStyles.line} />
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
    backgroundColor: GRIP_LINE_COLOR,
    borderRadius: 1,
    height: 20,
    width: 2,
  },
});
