/**
 * ConflictNotification - Shows when server data overrides local changes
 *
 * Implements conflict resolution UX (Audit Priority 4)
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { fontFamilies } from '@/theme/typography';

export interface ConflictNotificationProps {
  visible: boolean;
  conflictCount: number;
  onDismiss?: () => void;
  testID?: string;
}

export interface UseConflictNotificationResult {
  visible: boolean;
  conflictCount: number;
  showConflict: (count: number) => void;
  dismiss: () => void;
}

const ANIMATION_DURATION = 280;
const AUTO_DISMISS_DURATION = 4000;

export function ConflictNotification({
  visible,
  conflictCount,
  onDismiss,
  testID = 'conflict-notification',
}: ConflictNotificationProps) {
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

      // Auto-dismiss after duration
      if (onDismiss) {
        opacity.value = withDelay(
          AUTO_DISMISS_DURATION,
          withTiming(
            0,
            {
              duration: ANIMATION_DURATION,
              easing: Easing.in(Easing.cubic),
            },
            (finished) => {
              if (finished) {
                runOnJS(onDismiss)();
              }
            }
          )
        );
        translateY.value = withDelay(
          AUTO_DISMISS_DURATION,
          withTiming(-20, {
            duration: ANIMATION_DURATION,
            easing: Easing.in(Easing.cubic),
          })
        );
      }
    } else {
      opacity.value = 0;
      translateY.value = -20;
    }
  }, [visible, opacity, translateY, onDismiss]);

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
          backgroundColor: colors.status.warning,
        },
        animatedStyle,
      ]}
      testID={testID}
    >
      <Pressable
        style={styles.content}
        onPress={onDismiss}
        accessibilityLabel="Dismiss conflict notification"
        accessibilityRole="button"
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.surface }]}>
            Sync Conflict Resolved
          </Text>
          <Text style={[styles.message, { color: colors.surface }]}>
            {conflictCount} {conflictCount === 1 ? 'change was' : 'changes were'}{' '}
            overridden by server data
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Hook to manage conflict notification state
 */
export function useConflictNotification(): UseConflictNotificationResult {
  const [visible, setVisible] = useState(false);
  const [conflictCount, setConflictCount] = useState(0);

  const showConflict = useCallback((count: number) => {
    setConflictCount(count);
    setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    conflictCount,
    showConflict,
    dismiss,
  };
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  icon: {
    fontSize: 22,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
});
