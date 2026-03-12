/**
 * OfflineProvider Module
 *
 * React provider for offline queue restoration and management.
 *
 * @example
 * ```tsx
 * // In your app root
 * <OfflineProvider>
 *   <App />
 * </OfflineProvider>
 *
 * // In any component
 * const { isRestored, isRestoring } = useOfflineContext();
 * if (!isRestored) return <LoadingScreen />;
 * ```
 */

export { OfflineContext, OfflineProvider } from './Offline.provider';
export { useOfflineContext } from './useOfflineContext';
export type { OfflineContextValue, OfflineProviderProps } from './types';
