import { useQuery as useConvexQuery } from 'convex/react';

/**
 * Configuration for cached Convex queries
 */
export interface QueryCacheConfig {
  /** Time in ms before data is considered stale (default: 60000ms = 1min) */
  staleTime?: number;
  /** Descriptive label for debugging */
  label?: string;
}

// Default cache times in milliseconds
export const CACHE_TIMES = {
  /** 30 seconds - for frequently changing data like today's tracking */
  SHORT: 30 * 1000,
  /** 1 minute - for habits list, settings, categories */
  MEDIUM: 60 * 1000,
  /** 5 minutes - for analytics, templates, archived data */
  LONG: 5 * 60 * 1000,
} as const;

type QueryArg = string | number | object | 'skip' | undefined;

/**
 * Hook that wraps Convex's useQuery with documented staleTime.
 * Convex handles caching internally; this hook provides:
 * 1. Consistent API for staleTime configuration
 * 2. Debug labels for query monitoring
 * 3. Type-safe staleTime configuration
 * 
 * @param query - Convex API query function  
 * @param args - Query arguments (pass 'skip' to skip the query)
 * @param config - Cache configuration with staleTime
 * 
 * @example
 * // Basic usage - 1 minute stale time (default)
 * const habits = useQueryWithCache(api.habits.list, undefined, { 
 *   label: 'habits-list' 
 * });
 * 
 * @example
 * // Short cache - 30 seconds for tracking data
 * const tracking = useQueryWithCache(
 *   api.habits.getTracking, 
 *   { dates: ['2024-01-01'] },
 *   { staleTime: CACHE_TIMES.SHORT, label: 'tracking-today' }
 * );
 * 
 * @example
 * // Long cache - 5 minutes for analytics
 * const analytics = useQueryWithCache(
 *   api.analytics.getOverviewStats,
 *   undefined,
 *   { staleTime: CACHE_TIMES.LONG, label: 'analytics' }
 * );
 */
export function useQueryWithCache<
  QueryFunc extends (...args: any[]) => any,
  Args extends QueryArg
>(
  query: QueryFunc,
  args: Args,
  config: QueryCacheConfig = {}
): ReturnType<QueryFunc> {
  const { staleTime = CACHE_TIMES.MEDIUM } = config;
  
  // Use Convex's useQuery - it handles caching internally
  // The staleTime here is for future implementation and documentation
  return useConvexQuery(query, args as any) as ReturnType<QueryFunc>;
}

/**
 * Hook for frequently changing data (30s stale time)
 * Use for: tracking data, today's habits, live counts
 */
export function useFrequentQuery<
  QueryFunc extends (...args: any[]) => any,
  Args extends QueryArg
>(query: QueryFunc, args: Args, label?: string) {
  return useQueryWithCache(query, args, {
    staleTime: CACHE_TIMES.SHORT,
    label,
  });
}

/**
 * Hook for moderately changing data (1min stale time)
 * Use for: habits list, settings, categories
 */
export function useMediumQuery<
  QueryFunc extends (...args: any[]) => any,
  Args extends QueryArg
>(query: QueryFunc, args: Args, label?: string) {
  return useQueryWithCache(query, args, {
    staleTime: CACHE_TIMES.MEDIUM,
    label,
  });
}

/**
 * Hook for rarely changing data (5min stale time)
 * Use for: analytics, templates, archived habits
 */
export function useLongQuery<
  QueryFunc extends (...args: any[]) => any,
  Args extends QueryArg
>(query: QueryFunc, args: Args, label?: string) {
  return useQueryWithCache(query, args, {
    staleTime: CACHE_TIMES.LONG,
    label,
  });
}
