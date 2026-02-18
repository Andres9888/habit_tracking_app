/**
 * SocialProofBadge - Shows user count for credibility
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
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);
  const { colors: themeColors } = useThemeColors();

  useEffect(() => {
    opacity.value = withDelay(delay, withSpring(1));
    translateY.value = withDelay(delay, withSpring(0));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const dynamicStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: themeColors.primary[100],
      borderRadius: 9999,
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    text: {
      color: themeColors.primary[700],
      fontSize: 13,
    },
  });

  return (
    <Animated.View style={[dynamicStyles.container, animatedStyle]}>
      <Text style={styles.star}>⭐</Text>
      <Text style={dynamicStyles.text}>
        <Text style={styles.count}>{count}</Text> {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  count: {
    fontWeight: '600',
  },
  star: {
    fontSize: 13,
  },
});

export default SocialProofBadge;
