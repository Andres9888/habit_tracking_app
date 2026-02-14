/**
 * PerfectDayBadge - Compact badge showing perfect day streak count
 * Displayed in the home screen header when streak > 0
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PerfectDayBadgeProps {
  streak: number;
}

export function PerfectDayBadge({ streak }: PerfectDayBadgeProps) {
  if (streak <= 0) return null;

  return (
    <Animated.View entering={FadeIn.duration(280)} style={styles.badge}>
      <Text style={styles.text}>
        ⭐ {streak} perfect {streak === 1 ? 'day' : 'days'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(4, 120, 87, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: '#047857',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default PerfectDayBadge;
