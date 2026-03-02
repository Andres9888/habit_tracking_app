/**
 * LazyProviders
 *
 * Non-critical providers loaded after the initial paint to improve startup time.
 * Uses require() to defer module evaluation until the component mounts.
 */

import type { PropsWithChildren } from 'react';
import { useState, useEffect } from 'react';
import { StreakMilestoneProvider } from '../components/StreakMilestoneCelebration';

export function LazyProviders({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  /* eslint-disable @typescript-eslint/no-require-imports */
  const {
    PurchasesProvider,
  } = require('../components/providers/PurchasesProvider');
  const { NetworkStatusProvider } = require('../contexts/NetworkStatusContext');
  const { SyncStatusProvider } = require('../contexts/SyncStatusContext');
  const { OfflineProvider } = require('../providers/OfflineProvider');
  /* eslint-enable @typescript-eslint/no-require-imports */

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
