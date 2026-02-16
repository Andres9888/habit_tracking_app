/**
 * SocialProofBanner Component
 * Displays global habit completion stats to motivate users
 * Shows "X habits completed by Chain Day users today"
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { colors } from '../../../theme/colors';

interface SocialProofBannerProps {
  /** Total habits completed today across all users */
  globalCompletions?: number;
  /** Number of active users today */
  activeUsers?: number;
  /** Whether to show the banner */
  visible?: boolean;
  /** Reduce motion for accessibility */
  reduceMotion?: boolean;
}

export function SocialProofBanner({
  globalCompletions = 0,
  activeUsers = 0,
  visible = true,
  reduceMotion = false,
}: SocialProofBannerProps) {
  const [displayCount, setDisplayCount] = useState(globalCompletions);
  const scale = useSharedValue(1);

  // Animate number changes
  useEffect(() => {
    if (globalCompletions > displayCount && !reduceMotion) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 18, stiffness: 180 }),
        withSpring(1, { damping: 18, stiffness: 180 })
      );
    }
    setDisplayCount(globalCompletions);
  }, [globalCompletions, displayCount, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible || globalCompletions === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(280)}
      exiting={reduceMotion ? undefined : FadeOutUp.duration(280)}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name="people" size={20} color={colors.primary[500]} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            <Animated.Text style={[styles.count, animatedStyle]}>
              {displayCount.toLocaleString()}
            </Animated.Text>
            {' '}habits completed by Chain Day users today
          </Text>
          {activeUsers > 0 && (
            <Text style={styles.subtext}>
              {activeUsers.toLocaleString()} people building better habits right now
            </Text>
          )}
        </View>
      </View>
      <View style={styles.sparkles}>
        <Text style={styles.sparkle}>✨</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  count: {
    color: colors.primary[600],
    fontFamily: 'SF-Pro-Display-Bold',
    fontSize: 17,
    fontWeight: '700',
  },
  sparkle: {
    fontSize: 20,
  },
  sparkles: {
    opacity: 0.3,
    position: 'absolute',
    right: 12,
    top: 12,
  },
  subtext: {
    color: colors.text.tertiary,
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 13,
    marginTop: 2,
  },
  text: {
    color: colors.text.secondary,
    fontFamily: 'SF-Pro-Text-Regular',
    fontSize: 15,
    lineHeight: 20,
  },
  textContainer: {
    flex: 1,
  },
});
