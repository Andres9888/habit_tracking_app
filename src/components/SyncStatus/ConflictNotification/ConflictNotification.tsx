/**
 * ConflictNotification Component
 *
 * A brief, non-blocking notification that informs users when sync conflicts
 * were detected and automatically resolved using the completion-wins strategy.
 *
 * Implements US4 (Graceful Conflict Resolution) acceptance criteria 2:
 * "Given conflict occurs, When user notified, Then informational only, no action required"
 *
 * Implements FR-009: Display subtle, non-blocking indicators for sync status
 */

import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { GitMerge } from 'lucide-react-native';

import type { ConflictNotificationProps } from './types';
import { styles, ICON_SIZE, ICON_COLOR } from './styles';
import { useConflictNotificationAnimations } from './useConflictNotificationAnimations';

const DEFAULT_DURATION = 3000;

export function ConflictNotification({
  visible = false,
  conflictCount,
  duration = DEFAULT_DURATION,
  onDismiss,
  style,
  testID = 'conflict-notification',
}: ConflictNotificationProps) {
  const { animatedStyle, shouldRender } = useConflictNotificationAnimations({
    duration,
    onHidden: onDismiss,
    visible,
  });

  if (!shouldRender) {
    return null;
  }

  const showCount = conflictCount !== undefined && conflictCount > 0;
  const accessibilityLabel = showCount
    ? `${conflictCount} sync conflict${conflictCount === 1 ? '' : 's'} resolved`
    : 'Sync conflict resolved';

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
        <GitMerge color={ICON_COLOR} size={ICON_SIZE} strokeWidth={2.5} />
      </Animated.View>
      <Text style={styles.text}>Conflict resolved</Text>
      {showCount && (
        <Text style={styles.countText} testID={`${testID}-count`}>
          ({conflictCount})
        </Text>
      )}
    </Animated.View>
  );
}

export default ConflictNotification;
