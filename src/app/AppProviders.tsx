import { ClerkProvider } from '@clerk/clerk-expo';
import { resourceCache } from '@clerk/clerk-expo/resource-cache';
import type { PropsWithChildren } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';

import {
  clerkPublishableKey,
  hasClerkPublishableKey,
  hasConvexUrl,
  tokenCache,
} from '../lib/appConfig';
import {
  ConvexClerkProvider,
  LazyProviders,
  SentryUserSync,
} from '../providers';
import theme from '../theme';
import { MissingConfigFallback } from './MissingConfigFallback';
import { StartupErrorBoundary } from './StartupErrorBoundary';

const clerkKey = hasClerkPublishableKey ? clerkPublishableKey : '';

export function AppProviders({ children }: PropsWithChildren) {
  if (!hasClerkPublishableKey || !hasConvexUrl) {
    return <MissingConfigFallback />;
  }

  return (
    <StartupErrorBoundary>
      {/* Honor the OS "Reduce Motion" flag by default across all Reanimated
          animations; components override per-instance only to force motion. */}
      <ReducedMotionConfig mode={ReduceMotion.System} />
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ClerkProvider
            __experimental_resourceCache={resourceCache}
            publishableKey={clerkKey}
            tokenCache={tokenCache}
          >
            <SentryUserSync>
              <ConvexClerkProvider>
                <LazyProviders>{children}</LazyProviders>
              </ConvexClerkProvider>
            </SentryUserSync>
          </ClerkProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </StartupErrorBoundary>
  );
}
