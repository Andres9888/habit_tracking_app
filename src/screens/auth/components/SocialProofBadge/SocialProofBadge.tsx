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
import { useThemeColors } from '@/theme/ThemeContext';

interface SocialProofBadgeProps {
  count?: string;
  message?: string;
  delay?: number;
}

function SocialProofBadgeContent({
  count = '10,000+',
  message = 'people building better habits',
  delay = 400,
}: SocialProofBadgeProps) {
  const { colors: themeColors } = useThemeColors();
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

  const dynamicStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: themeColors.gray[50],
      borderRadius: 9999,
      flexDirection: 'row',
      // pill badge
      gap: 8,

      justifyContent: 'center',

      // amber-50
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
      color: themeColors.text.primary,
      fontSize: 13, // amber-800
    },
  });

  return (
    <Animated.View style={[dynamicStyles.container, animatedStyle]}>
      <Text style={dynamicStyles.star}>⭐</Text>
      <Text style={dynamicStyles.text}>
        <Text style={dynamicStyles.count}>{count}</Text> {message}
      </Text>
    </Animated.View>
  );
}

export function SocialProofBadge(props: SocialProofBadgeProps) {
  return <SocialProofBadgeContent {...props} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 9999,
    flexDirection: 'row',
    // pill badge
    gap: 8,

    justifyContent: 'center',

    // amber-50
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
    color: '#92400e',
    fontSize: 13, // amber-800
  },
});

export default SocialProofBadge;
