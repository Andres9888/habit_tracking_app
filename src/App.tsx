import '../global.css';

import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { ConvexProvider } from 'convex/react';
import { PropsWithChildren } from 'react';
import { PaperProvider } from 'react-native-paper';

import HabitsApp from './features/habits/HabitsApp';
import { clerkPublishableKey, convexClient, tokenCache } from './lib/appConfig';
import theme from './theme';

function Providers({ children }: PropsWithChildren) {
  return (
    <PaperProvider theme={theme}>
      <ConvexProvider client={convexClient}>{children}</ConvexProvider>
    </PaperProvider>
  );
}

export default function App() {
  if (!clerkPublishableKey) {
    console.warn('Running without authentication - Clerk key not configured');
    return (
      <Providers>
        <HabitsApp />
      </Providers>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Providers>
          <HabitsApp />
        </Providers>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
