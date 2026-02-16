/**
 * OfflineProvider Module - Barrel Export
 *
 * React provider for offline queue restoration and management.
 * Handles restoring persisted offline operations from AsyncStorage on app startup.
 *
 * **Quick Start:**
 * ```tsx
 * // 1. Add provider to app root (before components that use offline queue)
 * <OfflineProvider>
 *   <App />
 * </OfflineProvider>
 *
 * // 2. Use hook to check restoration status
 * const { isRestored, isRestoring, restoreQueue } = useOfflineContext();
 *
 * if (!isRestored) {
 *   return <LoadingScreen />;
 * }
 * ```
 *
 * **Provider Order:**
 * Place OfflineProvider early in the tree, before any components that might
 * enqueue offline operations. Typically after ClerkProvider and ConvexProvider.
 *
 * @module OfflineProvider
 * @see docs/offline-habit-sync.md for offline architecture
 */

// Provider & Context
export { OfflineContext, OfflineProvider } from './OfflineProvider';

// Hooks
export { useOfflineContext } from './useOfflineContext';

// Types
export type { OfflineContextValue, OfflineProviderProps } from './types';
