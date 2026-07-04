/**
 * SyncedToast Component
 *
 * A brief, non-blocking toast notification that confirms successful sync.
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 3:
 * "Given sync completes, When done, Then pending indicators disappear, brief 'Synced' confirmation"
 *
 * Implements FR-009: Display subtle, non-blocking indicators for sync status
 */

import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

import type { SyncedToastProps } from './types';
import { styles, ICON_SIZE, ICON_COLOR } from './styles';
import { useToastAnimations } from '../useToastAnimations';

const DEFAULT_DURATION = 2000;

export function SyncedToast({
  visible = false,
  syncedCount,
  duration = DEFAULT_DURATION,
  onDismiss,
  style,
  testID = 'synced-toast',
}: SyncedToastProps) {
  const { animatedStyle, shouldRender } = useToastAnimations({
    duration,
    onHidden: onDismiss,
    visible,
  });

  if (!shouldRender) {
    return null;
  }

  const showCount = syncedCount !== undefined && syncedCount > 0;
  const accessibilityLabel = showCount
    ? `Synced ${syncedCount} change${syncedCount === 1 ? '' : 's'}`
    : 'Changes synced';

  return (
    <Animated.View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion='polite'
      accessibilityRole='alert'
      style={[styles.container, animatedStyle, style]}
      testID={testID}
    >
      <Animated.View style={styles.iconContainer}>
        <Check color={ICON_COLOR} size={ICON_SIZE} strokeWidth={2.5} />
      </Animated.View>
      <Text style={styles.text}>Synced</Text>
      {showCount ? (
        <Text style={styles.countText} testID={`${testID}-count`}>
          ({syncedCount})
        </Text>
      ) : null}
    </Animated.View>
  );
}

export default SyncedToast;
