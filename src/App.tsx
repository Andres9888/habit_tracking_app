import '../global.css';

import { ConvexProvider } from 'convex/react';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { PropsWithChildren, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthGate } from './components/auth/AuthGate';
import { convexClient } from './lib/appConfig';
import theme from './theme';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

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
          console.log('Fallback to default token:', defaultToken ? 'SUCCESS' : 'NULL');
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
          <ConvexClerkProvider>
            {children}
          </ConvexClerkProvider>
        </ClerkProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Providers>
      <AuthGate />
    </Providers>
  );
}
