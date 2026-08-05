/**
 * OfflineIndicator Component
 *
 * A subtle visual indicator showing when the app is offline.
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 1:
 * "Given no connectivity, When viewing habits, Then subtle offline indicator visible"
 *
 * Implements FR-009: Display subtle, non-blocking indicators for offline status
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { WifiOff } from 'lucide-react-native';

import { colors } from '../../../theme/colors/core';
import type { OfflineIndicatorProps } from './types';
import { styles } from './styles';
import { useOfflineIndicator } from './useOfflineIndicator';

const ICON_SIZE = 12;
const ICON_COLOR = colors.gray[400];

export function OfflineIndicator({
  visible = false,
  style,
  testID = 'offline-indicator',
}: OfflineIndicatorProps) {
  const { animatedStyle, shouldRender } = useOfflineIndicator({ visible });

  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View
      accessible
      accessibilityLabel='You are offline. Changes will sync when reconnected.'
      accessibilityLiveRegion='polite'
      accessibilityRole='alert'
      style={[styles.container, animatedStyle, style]}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <WifiOff color={ICON_COLOR} size={ICON_SIZE} strokeWidth={2.5} />
      </View>
      <Text style={styles.text}>Offline</Text>
    </Animated.View>
  );
}

export default OfflineIndicator;
