/**
 * LazyProviders
 *
 * Non-critical providers loaded after the initial paint to improve startup time.
 * Currently imports providers eagerly so all module contracts are explicit.
 */

import type { PropsWithChildren } from 'react';
import { useState, useEffect } from 'react';
import { NetworkStatusProvider } from '../contexts/NetworkStatusContext/NetworkStatusProvider';
import { OfflineProvider } from '../providers/OfflineProvider/OfflineProvider';
import { PurchasesProvider } from '../components/providers/PurchasesProvider';
import { SyncStatusProvider } from '../contexts/SyncStatusContext/SyncStatusProvider';
import { StreakMilestoneProvider } from '../components/StreakMilestoneCelebration';

export function LazyProviders({ children }: PropsWithChildren) {
  if (
    typeof NetworkStatusProvider !== 'function' ||
    typeof OfflineProvider !== 'function' ||
    typeof SyncStatusProvider !== 'function' ||
    typeof PurchasesProvider !== 'function' ||
    typeof StreakMilestoneProvider !== 'function'
  ) {
    if (__DEV__) {
      console.error(
        '[LazyProviders] One or more providers failed to load.',
        {
          NetworkStatusProvider: typeof NetworkStatusProvider,
          OfflineProvider: typeof OfflineProvider,
          SyncStatusProvider: typeof SyncStatusProvider,
          PurchasesProvider: typeof PurchasesProvider,
          StreakMilestoneProvider: typeof StreakMilestoneProvider,
        }
      );
    }

    return <>{children}</>;
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

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
