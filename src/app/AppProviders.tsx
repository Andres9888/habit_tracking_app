/* eslint-disable max-lines */
import { ClerkProvider } from '@clerk/clerk-expo';
import type { PropsWithChildren } from 'react';
import { Component } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Pressable, Text, View } from 'react-native';

import { colors as palette } from '../theme/colors';
import {
  clerkPublishableKey,
  hasClerkPublishableKey,
  hasConvexUrl,
  tokenCache,
} from '../lib/appConfig';
import { ConvexClerkProvider, LazyProviders, SentryUserSync } from '../providers';
import theme from '../theme';
import { ThemeColorProvider } from '../theme/ThemeContext';

const clerkKey = hasClerkPublishableKey ? clerkPublishableKey : '';

function reloadWebPage(): void {
  if (globalThis.window) {
    globalThis.window.location.reload();
  }
}

function handleCriticalRetry(): void {
  if (globalThis.location) {
    globalThis.location.reload();
  }
}

function AppStartupFallback() {
  return (
    <View
      className='flex-1 items-center justify-center bg-white p-6'
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.light.background,
        paddingHorizontal: 24,
      }}
    >
      <Text
        className='mb-3 text-2xl font-bold'
        style={{ color: palette.gray[900], marginBottom: 12 }}
      >
        Startup Error
      </Text>
      <Text
        className='mb-6 text-center text-base'
        style={{ color: palette.gray[600], textAlign: 'center', marginBottom: 24 }}
      >
        The app did not finish loading. Tap retry to reload.
      </Text>
      <Pressable
        accessibilityLabel='Retry startup'
        className='mb-4 rounded-lg bg-black px-4 py-3'
        style={{ backgroundColor: palette.gray[900], paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 }}
        onPress={handleCriticalRetry}
      >
        <Text className='text-base font-semibold text-white' style={{ color: palette.text.inverse }}>
          Retry
        </Text>
      </Pressable>
    </View>
  );
}

type ErrorBoundaryState = {
  hasError: boolean;
};

class StartupErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch() {
    if (__DEV__) {
      // Keep startup issues visible in the fallback, do not rethrow.
    }
  }

  override render() {
    if (this.state.hasError) {
      return <AppStartupFallback />;
    }

    return this.props.children;
  }
}

// eslint-disable-next-line max-lines-per-function
function MissingConfigFallback() {
  const missingKeys = [];
  if (!hasClerkPublishableKey) missingKeys.push('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
  if (!hasConvexUrl) missingKeys.push('EXPO_PUBLIC_CONVEX_URL');

  return (
    <View
      className='flex-1 items-center justify-center bg-white p-6'
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.light.background,
        paddingHorizontal: 24,
      }}
    >
      <Text
        className='mb-3 text-2xl font-bold'
        style={{ color: palette.gray[900], marginBottom: 12 }}
      >
        Setup Required
      </Text>
      <Text
        className='mb-6 text-center text-base'
        style={{ color: palette.gray[600], textAlign: 'center', marginBottom: 24 }}
      >
        App config is incomplete. Set the missing environment variables and restart
        Metro.
      </Text>
      {missingKeys.map((key) => (
        <Text
          className='mb-2 rounded-lg px-3 py-2 text-sm font-medium'
          style={{ marginBottom: 8, backgroundColor: palette.gray[50], color: palette.gray[700], padding: 8, borderRadius: 8 }}
          key={key}
        >
          {key}
        </Text>
      ))}
      <Pressable
        accessibilityLabel='Reload app after updating environment variables'
        className='mt-2 rounded-lg bg-black px-4 py-3'
        style={{ backgroundColor: palette.gray[900], marginTop: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 }}
        onPress={reloadWebPage}
      >
        <Text className='text-base font-semibold text-white' style={{ color: palette.text.inverse }}>
          Retry
        </Text>
      </Pressable>
    </View>
  );
}

export function AppProviders({ children }: PropsWithChildren) {
  if (!hasClerkPublishableKey || !hasConvexUrl) {
    return <MissingConfigFallback />;
  }

  return (
    <StartupErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
            <SentryUserSync>
              <ConvexClerkProvider>
                <ThemeColorProvider>
                  <LazyProviders>{children}</LazyProviders>
                </ThemeColorProvider>
              </ConvexClerkProvider>
            </SentryUserSync>
          </ClerkProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </StartupErrorBoundary>
  );
}
