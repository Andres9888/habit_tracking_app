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
import { useEffect, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthGate } from './components/auth/AuthGate';
import { PurchasesProvider } from './components/providers/PurchasesProvider';
import { StreakMilestoneProvider } from './components/StreakMilestoneCelebration';
import { NetworkStatusProvider } from './contexts/NetworkStatusContext';
import { SyncStatusProvider } from './contexts/SyncStatusContext';
import { tokenCache } from './lib/appConfig';
import { initSentry, SentryErrorBoundary } from './lib/sentry';
import { ConvexClerkProvider, SentryUserSync } from './providers';
import { OfflineProvider } from './providers/OfflineProvider';
import { ThemeColorProvider } from './theme/ThemeContext';
import theme from './theme';

import { startNewSession } from './lib/analytics/conversionTracker';
import { loadABAssignments } from './lib/analytics/abTestFlags';

// Initialize Sentry as early as possible
initSentry();

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkKey) {
  throw new Error(
    'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required. Add it to .env.local'
  );
}

// Initialize conversion tracking and A/B test assignments
startNewSession();
void loadABAssignments();

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
  // Track new sessions when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        startNewSession();
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <Providers>
      <AuthGate />
    </Providers>
  );
}
