/**
 * App Root Component
 *
 * Main application entry point that sets up the provider hierarchy:
 * - Sentry: Error tracking and monitoring
 * - Clerk: Authentication
 * - Convex: Real-time database
 * - RevenueCat: Subscription management
 * - React Native Paper: UI theming
 *
 * The provider order matters for dependency injection.
 */

import '../global.css';

import { ClerkProvider } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthGate } from './components/auth/AuthGate';
import { PurchasesProvider } from './components/providers/PurchasesProvider';
import { StreakMilestoneProvider } from './components/StreakMilestoneCelebration';
import { NetworkStatusProvider } from './contexts/NetworkStatusContext';
import { SyncStatusProvider } from './contexts/SyncStatusContext';
import { initSentry, SentryErrorBoundary } from './lib/sentry';
import { ConvexClerkProvider, SentryUserSync } from './providers';
import { OfflineProvider } from './providers/OfflineProvider';
import theme from './theme';

// Initialize Sentry as early as possible
initSentry();

function Providers({ children }: PropsWithChildren) {
  return (
    <SentryErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ClerkProvider
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
          >
            <SentryUserSync>
              <ConvexClerkProvider>
                <NetworkStatusProvider>
                  <OfflineProvider>
                    <SyncStatusProvider>
                      <PurchasesProvider>
                        <StreakMilestoneProvider>
                          {children}
                        </StreakMilestoneProvider>
                      </PurchasesProvider>
                    </SyncStatusProvider>
                  </OfflineProvider>
                </NetworkStatusProvider>
              </ConvexClerkProvider>
            </SentryUserSync>
          </ClerkProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </SentryErrorBoundary>
  );
}

export default function App() {
  return (
    <Providers>
      <AuthGate />
    </Providers>
  );
}
