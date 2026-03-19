/**
 * SocialProofBadge - Shows user count for credibility
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';
import { colors } from '@/theme/colors';
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
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderRadius: 9999,
    flexDirection: 'row',
    // pill badge
    gap: 8,

    justifyContent: 'center',

    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  count: {
    fontWeight: '600',
  },
  star: {
    fontSize: 13, // caption scale
  },
  text: {
    // caption scale
    color: colors.warning,
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
  },
});

export default SocialProofBadge;
