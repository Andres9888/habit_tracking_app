/**
 * BadgeUnlockToast — Animated notification when a badge is newly unlocked.
 *
 * Slides in from top with a bounce, shows badge icon + name,
 * then auto-dismisses after 3 seconds.
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import type { BadgeData } from './useAchievements';

interface BadgeUnlockToastProps {
  badge: BadgeData | null;
  onDismiss: () => void;
}

export function BadgeUnlockToast({ badge, onDismiss }: BadgeUnlockToastProps) {
  const { colors, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const dismiss = useCallback(() => {
    translateY.value = withTiming(-120, { duration: 280 });
    opacity.value = withTiming(0, { duration: 280 }, () => {
      runOnJS(onDismiss)();
    });
  }, [onDismiss, translateY, opacity]);

  useEffect(() => {
    if (badge) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 14, stiffness: 200 });

      // Auto-dismiss after 3s
      const timer = setTimeout(dismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [badge]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!badge) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: insets.top + 8,
          left: 16,
          right: 16,
          zIndex: 9999,
        },
      ]}
    >
      <Pressable onPress={dismiss}>
        <View
          className="flex-row items-center gap-3 rounded-2xl border px-5 py-4"
          style={{
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderColor: isDark ? '#374151' : '#E5E7EB',
            shadowColor: '#000',
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <View className="h-12 w-12 items-center justify-center rounded-full" style={{
            backgroundColor: isDark ? '#374151' : '#FEF3C7',
          }}>
            <Text style={{ fontSize: 24 }}>{badge.badge.icon}</Text>
          </View>
          <View className="flex-1">
            <Text style={{ fontSize: 13, color: colors.primary[600], fontWeight: '700' }}>
              🎉 Badge Unlocked!
            </Text>
            <Text style={{ fontSize: 17, fontWeight: '600', color: colors.text.primary, letterSpacing: -0.41 }}>
              {badge.badge.name}
            </Text>
            <Text style={{ fontSize: 13, color: colors.text.secondary }}>
              {badge.badge.description}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
