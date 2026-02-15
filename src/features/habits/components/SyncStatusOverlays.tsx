/**
 * SyncStatusOverlays - Displays syncing indicator, synced toast,
 * stale data banner, and network error banner.
 * Absolute-positioned overlays at top of the habits screen.
 *
 * Updated by Opus: added StaleDataBanner for offline cached data indication.
 */

import { View } from 'react-native';
import {
  SyncingIndicator,
  SyncedToast,
  useSyncedToast,
  StaleDataBanner,
} from '../../../components/SyncStatus';
import { useSyncStatus } from '../../../contexts/SyncStatusContext';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';

export function SyncStatusOverlays() {
  const { status: syncStatus, triggerSync } = useSyncStatus();
  const { visible: syncedToastVisible, syncedCount } = useSyncedToast();
  const isOnline = useIsOnline();

  // Show stale data banner when offline and not actively syncing
  const showStaleData = !isOnline && !syncStatus.isSyncing;

  return (
    <>
      <View className='absolute left-0 right-0 top-20 z-50 flex-row justify-center'>
        <SyncingIndicator
          pendingCount={syncStatus.pendingCount}
          testID='global-syncing-indicator'
          visible={syncStatus.isSyncing}
        />
      </View>

      <View className='absolute left-0 right-0 top-32 z-50 flex-row justify-center'>
        <SyncedToast
          syncedCount={syncedCount}
          testID='global-synced-toast'
          visible={syncedToastVisible}
        />
      </View>

      <View className='absolute left-0 right-0 top-12 z-40'>
        <StaleDataBanner
          testID='global-stale-data-banner'
          visible={showStaleData}
          onRefresh={isOnline ? () => void triggerSync() : undefined}
        />
      </View>
    </>
  );
}
