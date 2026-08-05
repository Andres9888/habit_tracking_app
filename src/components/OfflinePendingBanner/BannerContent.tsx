import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './OfflinePendingBanner.styles';
import type { ProcessingState } from '../OfflineQueueProcessor';

interface BannerContentProps {
  isOffline: boolean;
  isProcessing: boolean;
  hasPendingItems: boolean;
  queueCount: number;
  processingState?: ProcessingState;
}

export function BannerContent({
  isOffline,
  isProcessing,
  hasPendingItems,
  queueCount,
  processingState,
}: BannerContentProps) {
  const title = isOffline
    ? "You're Offline"
    : isProcessing
      ? 'Syncing...'
      : hasPendingItems
        ? 'Pending Sync'
        : 'All Synced';

  const subtitle =
    isProcessing && processingState
      ? `${processingState.processedCount}/${processingState.totalItems} items`
      : hasPendingItems
        ? `${queueCount} item${queueCount === 1 ? '' : 's'} waiting`
        : 'Everything is up to date';

  return (
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
