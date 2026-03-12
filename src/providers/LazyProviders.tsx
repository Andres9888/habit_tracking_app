/**
 * LazyProviders
 *
 * Non-critical providers loaded after the initial paint to improve startup time.
 */

import type { PropsWithChildren } from 'react';

import { PurchasesProvider } from '../components/providers/Purchases.provider';
import { NetworkStatusProvider } from '../contexts/NetworkStatusContext/NetworkStatusProvider';
import { SyncStatusProvider } from '../contexts/SyncStatusContext/SyncStatusProvider';
import { StreakMilestoneProvider } from '../components/StreakMilestoneCelebration';
import { OfflineProvider } from './OfflineProvider/Offline.provider';

export function LazyProviders({ children }: PropsWithChildren) {
  return (
    <NetworkStatusProvider>
      <OfflineProvider>
        <SyncStatusProvider>
          <PurchasesProvider>
            <StreakMilestoneProvider>{children}</StreakMilestoneProvider>
          </PurchasesProvider>
        </SyncStatusProvider>
      </OfflineProvider>
    </NetworkStatusProvider>
  );
}
