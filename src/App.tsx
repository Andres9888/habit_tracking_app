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

import { ConvexProvider } from 'convex/react';
import { ClerkProvider } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthGate } from './components/auth/AuthGate';
import { PurchasesProvider } from './components/providers/PurchasesProvider';
import HabitsApp from './features/habits/HabitsApp';
import { convexClient } from './lib/appConfig';
import theme from './theme';
import { initSentry, SentryErrorBoundary } from './lib/sentry';
import { SentryUserSync, ConvexClerkProvider } from './providers';

// Initialize Sentry as early as possible
initSentry();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function Providers({ children }: PropsWithChildren) {
  return (
    <SentryErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <SentryUserSync>
              <ConvexClerkProvider>
                <PurchasesProvider>{children}</PurchasesProvider>
              </ConvexClerkProvider>
            </SentryUserSync>
          </ClerkProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </SentryErrorBoundary>
  );
}

function DevProviders({ children }: PropsWithChildren) {
  return (
    <SentryErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <ConvexProvider client={convexClient}>{children}</ConvexProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </SentryErrorBoundary>
  );
}

export default function App() {
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <DevProviders>
        <HabitsApp />
      </DevProviders>
    );
  }

  return (
    <Providers>
      <AuthGate />
    </Providers>
  );
}
