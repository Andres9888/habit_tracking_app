/**
 * OfflineBanner Component (Enhanced with Dark Mode)
 *
 * A clear, persistent banner showing offline status and pending sync count.
 * Supports dark mode and follows the design system.
 *
 * Design System:
 * - Typography: 13pt caption (design system locked)
 * - Border radius: 12px (design system)
 * - Shadows: 4px offset, 16px blur, 0.08 opacity
 * - Animation: springify().damping(18), 280ms
 * - Primary green: #047857 (text), #059669 (buttons)
 */

import React from 'react';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import { WifiOff, CloudOff, RefreshCw } from 'lucide-react-native';

import { styles } from './styles.enhanced';
import type { OfflineBannerProps } from './types';
import { useOfflineBannerLogic } from './useOfflineBannerLogic';

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
};

export function OfflineBanner({
  visible = false,
  pendingCount = 0,
  isSyncing = false,
  onSyncPress,
  testID = 'offline-banner',
}: OfflineBannerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { shouldRender, displayText } = useOfflineBannerLogic({
    visible,
    pendingCount,
    isSyncing,
  });

  // Slide-in animation
  const translateY = useSharedValue(visible ? 0 : -100);
  const opacity = useSharedValue(visible ? 1 : 0);

  // Pulse animation for pending count
  const pulseScale = useSharedValue(1);

  // Sync icon rotation
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, SPRING_CONFIG);
      opacity.value = withTiming(1, { duration: 280 });
    } else {
      translateY.value = withTiming(-100, { duration: 280 });
      opacity.value = withTiming(0, { duration: 280 });
    }
  }, [visible, translateY, opacity]);

  React.useEffect(() => {
    if (pendingCount > 0 && !isSyncing) {
      pulseScale.value = withSequence(
        withSpring(1.15, { damping: 10 }),
        withSpring(1, SPRING_CONFIG)
      );
    }
  }, [pendingCount, isSyncing, pulseScale]);

  React.useEffect(() => {
    if (isSyncing) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    } else {
      rotation.value = withTiming(0, { duration: 280 });
    }
  }, [isSyncing, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!shouldRender) {
    return null;
  }

  const showSyncButton = pendingCount > 0 && onSyncPress;

  return (
    <Animated.View
      accessible
      accessibilityLabel={displayText}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        styles.container,
        isDark && styles.containerDark,
        animatedStyle,
      ]}
      testID={testID}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
          {isSyncing ? (
            <Animated.View style={rotationStyle}>
              <RefreshCw color="#047857" size={16} strokeWidth={2.5} />
            </Animated.View>
          ) : (
            <CloudOff color={isDark ? '#fca5a5' : '#dc2626'} size={16} strokeWidth={2.5} />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.mainText, isDark && styles.mainTextDark]}>
            {isSyncing ? 'Syncing...' : 'You\'re offline'}
          </Text>
          {pendingCount > 0 && !isSyncing && (
            <Animated.View style={pulseStyle}>
              <Text style={[styles.countText, isDark && styles.countTextDark]}>
                {pendingCount} {pendingCount === 1 ? 'change' : 'changes'} pending
              </Text>
            </Animated.View>
          )}
          {isSyncing && pendingCount > 0 && (
            <Text style={[styles.countText, isDark && styles.countTextDark]}>
              {pendingCount} {pendingCount === 1 ? 'item' : 'items'} remaining
            </Text>
          )}
        </View>

        {showSyncButton && !isSyncing && (
          <Pressable
            accessibilityLabel="Retry sync"
            accessibilityRole="button"
            style={[styles.syncButton, isDark && styles.syncButtonDark]}
            onPress={onSyncPress}
          >
            <RefreshCw color="#047857" size={14} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

export default OfflineBanner;
