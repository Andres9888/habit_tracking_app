/**
 * NetworkErrorBanner Component
 *
 * Dismissible inline banner shown when a network request fails.
 * Displays a clear message ("Check your connection") with a tap-to-retry action.
 *
 * Created by Opus.
 */

import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { WifiOff, RefreshCw, X } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from './styles';

export interface NetworkErrorBannerProps {
  /** Whether the banner is visible */
  visible: boolean;
  /** User-friendly error message */
  message?: string;
  /** Called when user taps "Tap to retry" */
  onRetry?: () => void;
  /** Called when user dismisses the banner */
  onDismiss?: () => void;
  /** Whether retry is currently in progress */
  isRetrying?: boolean;
  /** Test ID for testing */
  testID?: string;
}

const ICON_SIZE = 16;
const DISMISS_ICON_SIZE = 14;
const SPRING_CONFIG = { damping: 18, stiffness: 200 };

export function NetworkErrorBanner({
  visible,
  message = 'Check your connection',
  onRetry,
  onDismiss,
  isRetrying = false,
  testID = 'network-error-banner',
}: NetworkErrorBannerProps) {
  const { isDark } = useThemeColors();
  const retryScale = useSharedValue(1);

  const handleRetryPress = useCallback(() => {
    if (isRetrying) return;
    retryScale.value = withSpring(0.95, SPRING_CONFIG, () => {
      retryScale.value = withSpring(1, SPRING_CONFIG);
    });
    onRetry?.();
  }, [isRetrying, onRetry, retryScale]);

  const retryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: retryScale.value }],
  }));

  if (!visible) return null;

  const bannerStyles = isDark ? styles.containerDark : styles.container;
  const textColor = isDark ? '#fafaf9' : '#44403c';
  const iconColor = isDark ? '#ef4444' : '#dc2626';
  const retryColor = isDark ? '#60a5fa' : '#2563eb';
  const dismissColor = isDark ? '#a8a29e' : '#78716c';

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18).duration(280)}
      exiting={FadeOutUp.springify().damping(18).duration(200)}
      style={bannerStyles}
      testID={testID}
    >
      <View style={styles.content}>
        <WifiOff color={iconColor} size={ICON_SIZE} strokeWidth={2.5} />
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      </View>

      <View style={styles.actions}>
        {onRetry && (
          <Animated.View style={retryAnimatedStyle}>
            <Pressable
              accessibilityLabel='Tap to retry'
              accessibilityRole='button'
              hitSlop={8}
              style={styles.retryButton}
              onPress={handleRetryPress}
            >
              <RefreshCw
                color={retryColor}
                size={ICON_SIZE - 2}
                strokeWidth={2.5}
              />
              <Text style={[styles.retryText, { color: retryColor }]}>
                {isRetrying ? 'Retrying…' : 'Tap to retry'}
              </Text>
            </Pressable>
          </Animated.View>
        )}

        {onDismiss && (
          <Pressable
            accessibilityLabel='Dismiss error'
            accessibilityRole='button'
            hitSlop={8}
            style={styles.dismissButton}
            onPress={onDismiss}
          >
            <X color={dismissColor} size={DISMISS_ICON_SIZE} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

export default NetworkErrorBanner;
