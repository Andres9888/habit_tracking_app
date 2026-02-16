/**
 * Providers Module - Barrel Export
 *
 * ARCHITECTURE NOTE: Provider/Context Location Inconsistencies
 * ============================================================
 *
 * The app has mixed conventions for organizing providers and contexts:
 *
 * 1. **src/providers/** (this directory)
 *    - OfflineProvider - Queue restoration provider
 *    - ConvexClerkProvider - Auth integration
 *    - SentryUserSync - Error tracking
 *    → These are true "providers" (non-React Context integrations)
 *
 * 2. **src/contexts/** (React Context pattern)
 *    - NetworkStatusContext/ - Network connectivity state
 *    - SyncStatusContext/ - Sync orchestration state
 *    - PerformanceContext/ - Performance monitoring
 *    → Well-organized with Provider/Context/hooks separation
 *
 * 3. **src/components/providers/** (INCONSISTENT LOCATION)
 *    - PurchasesProvider.tsx - RevenueCat integration
 *    → Should be in src/providers/ for consistency
 *
 * 4. **src/components/StreakMilestoneCelebration/** (INCONSISTENT LOCATION)
 *    - StreakMilestoneProvider.tsx - Global celebration state
 *    → Should be in src/contexts/ (it's a React Context pattern)
 *    → Alternative: extract provider to src/contexts/StreakMilestoneContext/
 *
 * 5. **src/theme/** (Domain-specific location)
 *    - ThemeContext.tsx - Theme color provider
 *    → Acceptable location (theme-specific domain)
 *
 * RECOMMENDATION:
 * - Move PurchasesProvider from src/components/providers/ → src/providers/
 * - Extract StreakMilestoneProvider from src/components/ → src/contexts/StreakMilestoneContext/
 * - Keep component-specific logic in src/components/StreakMilestoneCelebration/
 * - Establish clear convention: src/providers/ for integrations, src/contexts/ for React Context patterns
 *
 * NOTE: File moves deferred to avoid breaking changes in this PR
 */

export { SentryUserSync } from './SentryUserSync';
export { ConvexClerkProvider, useConvexAuthReady } from './ConvexClerkProvider';
export { OfflineProvider, OfflineContext } from './OfflineProvider';
export { useOfflineContext } from './OfflineProvider';
export type {
  OfflineContextValue,
  OfflineProviderProps,
} from './OfflineProvider';
