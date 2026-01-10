import '../global.css';

import { ConvexProvider } from 'convex/react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { PropsWithChildren, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthGate } from './components/auth/AuthGate';
import HabitsApp from './features/habits/HabitsApp';
import { convexClient } from './lib/appConfig';
import theme from './theme';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Component to sync Clerk auth token with Convex
function ConvexClerkProvider({ children }: PropsWithChildren) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    // Set auth token fetcher for Convex
    convexClient.setAuth(async () => {
      if (!isSignedIn) {
        return null;
      }

      try {
        // Get the Clerk token with 'convex' JWT template
        // Make sure you've created this template in Clerk Dashboard
        const token = await getToken({ template: 'convex' });
        console.log('Convex auth token fetched:', token ? 'SUCCESS' : 'NULL');
        return token ?? null;
      } catch (error) {
        console.error('Failed to get Clerk token:', error);
        // Fallback to default token if template doesn't exist
        try {
          const defaultToken = await getToken();
          console.log(
            'Fallback to default token:',
            defaultToken ? 'SUCCESS' : 'NULL'
          );
          return defaultToken ?? null;
        } catch {
          return null;
        }
      }
    });
  }, [getToken, isSignedIn]);

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}

function Providers({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <ConvexClerkProvider>{children}</ConvexClerkProvider>
        </ClerkProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

// Dev mode providers (no auth required)
function DevProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ConvexProvider client={convexClient}>{children}</ConvexProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  // Skip auth in dev mode if no Clerk key is configured
  if (!CLERK_PUBLISHABLE_KEY) {
    if (__DEV__) {
      console.log('Running in dev mode without authentication');
    }
    return (
      <DevProviders>
        <HabitsApp />
      </DevProviders>
    );
  }

  // Production mode with full auth
  return (
    <Providers>
      <AuthGate />
    </Providers>
  );
}
