/**
 * LazyProviders
 *
 * Non-critical providers loaded after the initial paint to improve startup time.
 */

import type { PropsWithChildren } from 'react';

import { NetworkStatusProvider } from '../contexts/NetworkStatusContext/NetworkStatusProvider';
import { SyncStatusProvider } from '../contexts/SyncStatusContext/SyncStatusProvider';
import { StreakMilestoneProvider } from '../components/StreakMilestoneCelebration';
import { OfflineProvider } from './OfflineProvider/Offline.provider';

export function LazyProviders({ children }: PropsWithChildren) {
  return (
    <NetworkStatusProvider>
      <OfflineProvider>
        <SyncStatusProvider>
          <StreakMilestoneProvider>{children}</StreakMilestoneProvider>
        </SyncStatusProvider>
      </OfflineProvider>
    </NetworkStatusProvider>
  );
}
