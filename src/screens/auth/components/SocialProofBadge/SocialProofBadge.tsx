/**
 * SocialProofBadge - Shows user count for credibility
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

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
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.star}>⭐</Text>
      <Text style={styles.text}>
        <Text style={styles.count}>{count}</Text> {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffbeb', // amber-50
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  star: {
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    color: '#92400e', // amber-800
  },
  count: {
    fontWeight: '600',
  },
});

export default SocialProofBadge;
