/**
 * App Root Component
 *
 * Main application entry point that sets up the provider hierarchy.
 * Provider order is critical — each layer depends on the ones above it.
 * See {@link buildProviderTree} for the grouped dependency chain.
 */

import '../global.css';

import { ClerkProvider } from '@clerk/clerk-expo';
import type { ComponentType, PropsWithChildren } from 'react';
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

// ---------------------------------------------------------------------------
// Sentry Initialization
// ---------------------------------------------------------------------------

/**
 * Defers Sentry init until the main thread is idle so it doesn't block
 * the first paint. Falls back to setTimeout(0) on platforms without
 * requestIdleCallback.
 */
function scheduleSentryInit(): void {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => initSentry());
  } else {
    setTimeout(() => initSentry(), 0);
  }
}

scheduleSentryInit();

// ---------------------------------------------------------------------------
// Clerk key validation
// ---------------------------------------------------------------------------

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkKey) {
  throw new Error(
    'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required. Add it to .env.local'
  );
}

// ---------------------------------------------------------------------------
// Provider composition utility
// ---------------------------------------------------------------------------

/**
 * Composes an array of providers (with optional props) into a single
 * wrapper component, eliminating deeply-nested JSX pyramids.
 *
 * Providers render in array order — the first entry is the outermost wrapper.
 *
 * @example
 * ```tsx
 * const Tree = composeProviders([
 *   [ThemeProvider, { theme: dark }],
 *   AuthProvider,
 * ]);
 * <Tree><App /></Tree>
 * ```
 */
function composeProviders(
  providers: Array<ComponentType<any> | [ComponentType<any>, Record<string, unknown>]>
): ComponentType<PropsWithChildren> {
  return providers.reduceRight<ComponentType<PropsWithChildren>>(
    (Accumulated, entry) => {
      const [Provider, props] = Array.isArray(entry) ? entry : [entry, {}];
      return function Composed({ children }: PropsWithChildren) {
        return (
          <Provider {...props}>
            <Accumulated>{children}</Accumulated>
          </Provider>
        );
      };
    },
    ({ children }: PropsWithChildren) => <>{children}</>
  );
}

// ---------------------------------------------------------------------------
// Provider tree
// ---------------------------------------------------------------------------

/**
 * Builds the full provider tree, grouped by concern.
 *
 * ### Dependency chain (outermost → innermost):
 *
 * **Error Boundary** — catches everything below
 * 1. SentryErrorBoundary
 *
 * **Platform / UI chrome** — no dependencies, needed by all UI
 * 2. SafeAreaProvider    — insets for notches/status bars
 * 3. PaperProvider       — Material Design theme & components
 *
 * **Authentication** — must wrap anything that calls useAuth / useUser
 * 4. ClerkProvider       — auth session, token cache
 * 5. SentryUserSync      — tags Sentry events with current user (needs Clerk)
 *
 * **Data layer** — needs auth tokens from Clerk
 * 6. ConvexClerkProvider — syncs Clerk JWT → Convex client
 *
 * **Theming** — reads user prefs from Convex
 * 7. ThemeColorProvider
 *
 * **Connectivity & sync** — depend on Convex + theme context
 * 8. NetworkStatusProvider
 * 9. OfflineProvider
 * 10. SyncStatusProvider
 *
 * **Feature providers** — depend on auth, data, and connectivity
 * 11. PurchasesProvider        — RevenueCat subscriptions (needs auth)
 * 12. StreakMilestoneProvider   — celebration overlays (needs data)
 */
const Providers = composeProviders([
  // ── Error boundary ───────────────────────────────────────────────
  SentryErrorBoundary,

  // ── Platform / UI chrome ─────────────────────────────────────────
  SafeAreaProvider,
  [PaperProvider, { theme }],

  // ── Authentication ───────────────────────────────────────────────
  [ClerkProvider, { publishableKey: clerkKey, tokenCache }],
  SentryUserSync,

  // ── Data layer (needs Clerk auth) ────────────────────────────────
  ConvexClerkProvider,

  // ── Theming (reads user prefs from Convex) ───────────────────────
  ThemeColorProvider,

  // ── Connectivity & sync ──────────────────────────────────────────
  NetworkStatusProvider,
  OfflineProvider,
  SyncStatusProvider,

  // ── Feature providers ────────────────────────────────────────────
  PurchasesProvider,
  StreakMilestoneProvider,
]);

export default function App() {
  return (
    <Providers>
      <AuthGate />
    </Providers>
  );
}
