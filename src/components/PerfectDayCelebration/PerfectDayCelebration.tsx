/**
 * PerfectDayCelebration - Full-screen overlay when ALL habits are completed
 *
 * Features:
 * - Full-screen confetti burst
 * - "Perfect Day! 🎉" text with auto-dismiss after 2s
 * - Haptic pattern: success → light → light → medium
 * - Perfect day streak count
 * - Premium upsell CTA
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { FullScreenConfetti } from './FullScreenConfetti';

interface PerfectDayCelebrationProps {
  visible: boolean;
  perfectDayStreak: number;
  isPremiumUser: boolean;
  reduceMotion: boolean;
  onDismiss: () => void;
  onUpgradePress: () => void;
}

const AUTO_DISMISS_MS = 2000;
const isHapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function triggerPerfectDayHaptics(reduceMotion: boolean): Promise<void> {
  if (!isHapticsSupported || reduceMotion) return;
  try {
    // Pattern: success → light → light → medium
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await wait(100);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await wait(80);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await wait(80);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Haptics are non-critical
  }
}

export function PerfectDayCelebration({
  visible,
  perfectDayStreak,
  isPremiumUser,
  reduceMotion,
  onDismiss,
  onUpgradePress,
}: PerfectDayCelebrationProps) {
  const { colors } = useThemeColors();
  const titleScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const streakOpacity = useSharedValue(0);
  const upsellOpacity = useSharedValue(0);

  const handleDismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!visible) {
      titleScale.value = 0;
      titleOpacity.value = 0;
      streakOpacity.value = 0;
      upsellOpacity.value = 0;
      return;
    }

    // Fire haptics
    void triggerPerfectDayHaptics(reduceMotion);

    // Animate title in
    titleOpacity.value = withTiming(1, { duration: 200 });
    titleScale.value = withSequence(
      withSpring(1.15, { damping: 12 }),
      withSpring(1, { damping: 18 })
    );

    // Streak count fades in after title
    streakOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));

    // Upsell fades in last
    if (!isPremiumUser) {
      upsellOpacity.value = withDelay(800, withTiming(1, { duration: 300 }));
    }

    // Auto-dismiss
    const timer = setTimeout(() => {
      titleOpacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(handleDismiss)();
      });
      streakOpacity.value = withTiming(0, { duration: 200 });
      upsellOpacity.value = withTiming(0, { duration: 200 });
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [visible, reduceMotion, isPremiumUser, titleScale, titleOpacity, streakOpacity, upsellOpacity, handleDismiss]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const streakStyle = useAnimatedStyle(() => ({
    opacity: streakOpacity.value,
  }));

  const upsellStyle = useAnimatedStyle(() => ({
    opacity: upsellOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={handleDismiss}>
      {/* Full-screen confetti */}
      {!reduceMotion && <FullScreenConfetti />}

      {/* Center content */}
      <View style={styles.content}>
        <Animated.View style={titleStyle}>
          <Text style={[styles.emoji]}>🎉</Text>
          <Text style={[styles.title, { color: '#FFFFFF' }]}>
            Perfect Day!
          </Text>
        </Animated.View>

        <Animated.View style={streakStyle}>
          {perfectDayStreak > 1 ? (
            <Text style={[styles.streak, { color: 'rgba(255,255,255,0.85)' }]}>
              {perfectDayStreak} perfect days in a row 🔥
            </Text>
          ) : (
            <Text style={[styles.streak, { color: 'rgba(255,255,255,0.85)' }]}>
              Every habit done — amazing!
            </Text>
          )}
        </Animated.View>

        {!isPremiumUser && (
          <Animated.View style={upsellStyle}>
            <Pressable
              style={styles.upsellButton}
              onPress={() => {
                onUpgradePress();
                onDismiss();
              }}
            >
              <Text style={styles.upsellText}>
                ✨ Unlock detailed perfect day analytics
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    zIndex: 9999,
  },
  streak: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
  },
  upsellButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  upsellText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PerfectDayCelebration;
