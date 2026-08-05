/**
 * LazyProviders
 *
 * Non-critical providers loaded after the initial paint to improve startup time.
 */

import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { PurchasesProvider } from '../components/providers/Purchases.provider';
import { NetworkStatusProvider } from '../contexts/NetworkStatusContext/NetworkStatusProvider';
import { SyncStatusProvider } from '../contexts/SyncStatusContext/SyncStatusProvider';
import { StreakMilestoneProvider } from '../components/StreakMilestoneCelebration';
import { ThemeColorProvider } from '../theme/ThemeContext';
import { OfflineProvider } from './OfflineProvider/Offline.provider';
import { QueryCacheProvider } from './QueryCacheProvider';
import { registerOfflineQueueBackgroundSync } from '../lib/offline/backgroundSync';

export function LazyProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    registerOfflineQueueBackgroundSync().catch((error) => {
      if (__DEV__) console.warn('[backgroundSync] registration failed', error);
    });
  }, []);

  return (
    <NetworkStatusProvider>
      <OfflineProvider>
        <QueryCacheProvider>
          <SyncStatusProvider>
            <ThemeColorProvider>
              <PurchasesProvider>
                <StreakMilestoneProvider>{children}</StreakMilestoneProvider>
              </PurchasesProvider>
            </ThemeColorProvider>
          </SyncStatusProvider>
        </QueryCacheProvider>
      </OfflineProvider>
    </NetworkStatusProvider>
  );
}
