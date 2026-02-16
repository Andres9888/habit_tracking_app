/**
 * SocialProofBadge - Shows user count for credibility
 * Dark mode aware
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SocialProofBadgeProps {
  count?: string;
  message?: string;
  delay?: number;
}

export function SocialProofBadge({
  count = '10,000+',
  message = 'people building better habits',
  delay = 400,
}: SocialProofBadgeProps) {
  const { colors, isDark } = useThemeColors();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(delay, withSpring(1));
    translateY.value = withDelay(delay, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#422006' : '#fffbeb' },
        animatedStyle,
      ]}
    >
      <Text style={styles.star}>⭐</Text>
      <Text style={[styles.text, { color: isDark ? '#FBBF24' : '#92400e' }]}>
        <Text style={styles.count}>{count}</Text> {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 9999,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  count: {
    fontWeight: '600',
  },
  star: {
    fontSize: 13,
  },
  text: {
    fontSize: 13,
  },
});

export default SocialProofBadge;
