/**
 * StaleDataBanner Component
 *
 * Subtle indicator shown when the app is displaying cached/stale data
 * because the device is offline. Lets users know data may not be current.
 *
 * Created by Opus.
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Clock, RefreshCw } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from './styles';

export interface StaleDataBannerProps {
  /** Whether the banner is visible */
  visible: boolean;
  /** Optional: how long ago data was last synced */
  lastSyncedLabel?: string;
  /** Called when user taps refresh */
  onRefresh?: () => void;
  /** Test ID */
  testID?: string;
}

const ICON_SIZE = 14;

export function StaleDataBanner({
  visible,
  lastSyncedLabel,
  onRefresh,
  testID = 'stale-data-banner',
}: StaleDataBannerProps) {
  const { isDark } = useThemeColors();

  if (!visible) return null;

  const containerStyle = isDark ? styles.containerDark : styles.container;
  const textColor = isDark ? '#a8a29e' : '#78716c'; // stone-400 / stone-500
  const iconColor = isDark ? '#78716c' : '#a8a29e';

  const label = lastSyncedLabel
    ? `Showing cached data · Last synced ${lastSyncedLabel}`
    : 'Showing cached data';

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18).duration(280)}
      exiting={FadeOutUp.springify().damping(18).duration(200)}
      style={containerStyle}
      testID={testID}
    >
      <View style={styles.content}>
        <Clock color={iconColor} size={ICON_SIZE} strokeWidth={2} />
        <Text style={[styles.text, { color: textColor }]}>{label}</Text>
      </View>

      {onRefresh && (
        <Pressable
          accessibilityLabel='Refresh data'
          accessibilityRole='button'
          hitSlop={8}
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <RefreshCw color={textColor} size={ICON_SIZE - 2} strokeWidth={2.5} />
        </Pressable>
      )}
    </Animated.View>
  );
}

export default StaleDataBanner;
