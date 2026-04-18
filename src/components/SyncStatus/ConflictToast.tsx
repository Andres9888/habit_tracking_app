/**
 * ConflictToast - Shows when server data overrides local changes
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { fontFamilies, fontWeights } from '@/theme/typography';

interface ConflictToastProps {
  visible: boolean;
  conflictCount: number;
  testID?: string;
}

const ANIMATION_DURATION = 280;
const DISPLAY_DURATION = 3000;

export function ConflictToast({
  visible,
  conflictCount,
  testID,
}: ConflictToastProps) {
  const { colors } = useThemeColors();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (visible) {
      // Fade in
      opacity.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      translateY.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });

      // Fade out after display duration
      opacity.value = withDelay(
        DISPLAY_DURATION,
        withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.in(Easing.cubic),
        })
      );
      translateY.value = withDelay(
        DISPLAY_DURATION,
        withTiming(-20, {
          duration: ANIMATION_DURATION,
          easing: Easing.in(Easing.cubic),
        })
      );
    }
  }, [visible, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.warning || '#F59E0B',
        },
        animatedStyle,
      ]}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.surface }]}>
          Sync Conflict
        </Text>
        <Text style={[styles.message, { color: colors.surface }]}>
          {conflictCount} {conflictCount === 1 ? 'change' : 'changes'} overridden
          by server
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  icon: { fontSize: 20 },
  iconContainer: { marginRight: 12 },
  message: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: fontWeights.regular,
  },
  textContainer: { flex: 1 },
  title: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    marginBottom: 2,
  },
});
