/**
 * SyncStatusOverlays - Displays syncing indicator and synced toast
 * Absolute-positioned overlays at top of the habits screen
 */

import { View } from 'react-native';
import {
  SyncingIndicator,
  SyncedToast,
  useSyncedToast,
} from '../../../components/SyncStatus';
import { useSyncStatus } from '../../../contexts/SyncStatusContext';

export function SyncStatusOverlays() {
  const { status: syncStatus } = useSyncStatus();
  const { visible: syncedToastVisible, syncedCount } = useSyncedToast();

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
    </>
  );
}
