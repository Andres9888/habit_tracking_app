/**
 * FailedSyncBanner Component
 *
 * Surfaces permanently-failed sync operations with Retry / Discard actions.
 * Visible when there are failed operations and sync is not currently running.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import type { FailedSyncBannerProps } from './types';
import { styles } from './styles';
import { useFailedSyncBanner } from './useFailedSyncBanner';

function buildMessage(count: number): string {
  return `${count} change${count === 1 ? '' : 's'} couldn’t sync`;
}

export function FailedSyncBanner({
  visible,
  failedCount,
  isRetrying,
  onRetry,
  onDiscard,
  style,
  testID = 'failed-sync-banner',
}: FailedSyncBannerProps) {
  const hook = useFailedSyncBanner();

  const isVisible = visible ?? hook.visible;
  const count = failedCount ?? hook.failedCount;
  const retrying = isRetrying ?? hook.isRetrying;
  const handleRetry = onRetry ?? hook.handleRetry;
  const handleDiscard = onDiscard ?? hook.handleDiscard;

  if (!isVisible) return null;

  return (
    <View
      accessibilityRole='alert'
      style={[styles.container, style]}
      testID={testID}
    >
      <Text style={styles.message} testID={`${testID}-message`}>
        {buildMessage(count)}
      </Text>
      <View style={styles.buttonRow}>
        <Pressable
          accessibilityRole='button'
          disabled={retrying}
          onPress={handleDiscard}
          style={[styles.button, styles.discardButton]}
          testID={`${testID}-discard`}
        >
          <Text style={styles.discardText}>Discard</Text>
        </Pressable>
        <Pressable
          accessibilityRole='button'
          disabled={retrying}
          onPress={handleRetry}
          style={[
            styles.button,
            styles.retryButton,
            retrying && styles.buttonDisabled,
          ]}
          testID={`${testID}-retry`}
        >
          <Text style={styles.retryText}>
            {retrying ? 'Retrying…' : 'Try again'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default FailedSyncBanner;
