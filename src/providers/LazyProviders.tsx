/**
 * LazyProviders
 *
 * Non-critical providers loaded after the initial paint to improve startup time.
 */

import type { PropsWithChildren } from 'react';
import { NetworkStatusProvider } from '../contexts/NetworkStatusContext/NetworkStatusProvider';
import { OfflineProvider } from './OfflineProvider/OfflineProvider';
import { SyncStatusProvider } from '../contexts/SyncStatusContext/SyncStatusProvider';
import { PurchasesProvider } from '../components/providers/PurchasesProvider';
import { StreakMilestoneProvider } from '../components/StreakMilestoneCelebration';

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
