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

import type { PropsWithChildren } from 'react';

import '../global.css';
import { ClerkProvider } from '@clerk/clerk-expo';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import theme from './theme';
import { AuthGate } from './components/auth/AuthGate';
import { ConvexClerkProvider, SentryUserSync } from './providers';
import { NetworkStatusProvider } from './contexts/NetworkStatusContext';
import { OfflineProvider } from './providers/OfflineProvider';
import { PurchasesProvider } from './components/providers/PurchasesProvider';
import { StreakMilestoneProvider } from './components/StreakMilestoneCelebration';
import { SyncStatusProvider } from './contexts/SyncStatusContext';
import { ThemeColorProvider } from './theme/ThemeContext';
import { initSentry, SentryErrorBoundary } from './lib/sentry';
import { tokenCache } from './lib/appConfig';

// Initialize Sentry as early as possible
initSentry();

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkKey) {
  throw new Error(
    'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required. Add it to .env.local'
  );
}

function Providers({ children }: PropsWithChildren) {
  return (
    <SentryErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
            <SentryUserSync>
              <ConvexClerkProvider>
                <ThemeColorProvider>
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
                </ThemeColorProvider>
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
