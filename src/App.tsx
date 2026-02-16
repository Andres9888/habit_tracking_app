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
 * Performance optimizations:
 * - Sentry init deferred with requestIdleCallback
 * - Non-critical providers lazy loaded after first paint
 * - Provider chain optimized to minimize blocking
 */

import './i18n/i18n'; // Initialize i18n before anything else
import '../global.css';

import { ClerkProvider } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { useState, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthGate } from './components/auth/AuthGate';
import { tokenCache } from './lib/appConfig';
import { initSentry, SentryErrorBoundary } from './lib/sentry';
import { ConvexClerkProvider, SentryUserSync } from './providers';
import { ThemeColorProvider } from './theme/ThemeContext';
import theme from './theme';

// Initialize Sentry after first frame to avoid blocking app launch.
// requestIdleCallback (or setTimeout fallback) defers this work until
// the main thread is idle, keeping the first paint fast.
if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(() => initSentry());
} else {
  setTimeout(() => initSentry(), 0);
}

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkKey) {
  throw new Error(
    'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required. Add it to .env.local'
  );
}

/**
 * Lazy-loaded providers that don't block critical rendering path.
 * These are loaded after the initial paint to improve startup time.
 */
function LazyProviders({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load non-critical providers after a short delay
    // This ensures the critical path renders first
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  // Dynamic imports for heavy providers
  const { PurchasesProvider } = require('./components/providers/PurchasesProvider');
  const { StreakMilestoneProvider } = require('./components/StreakMilestoneCelebration');
  const { NetworkStatusProvider } = require('./contexts/NetworkStatusContext');
  const { SyncStatusProvider } = require('./contexts/SyncStatusContext');
  const { OfflineProvider } = require('./providers/OfflineProvider');

  return (
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
  );
}

/**
 * Core providers needed for authentication and data access.
 * These are loaded immediately as they're required for the app to function.
 */
function CoreProviders({ children }: PropsWithChildren) {
  return (
    <SentryErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
            <SentryUserSync>
              <ConvexClerkProvider>
                <ThemeColorProvider>
                  <LazyProviders>
                    {children}
                  </LazyProviders>
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
    <CoreProviders>
      <AuthGate />
    </CoreProviders>
  );
}
