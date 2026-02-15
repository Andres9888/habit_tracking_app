/**
 * usePerformance Hook
 * Access performance monitoring context in components.
 */

import { useContext } from 'react';

import type { PerformanceContextValue } from '../../contexts/PerformanceContext';
import { PerformanceContext } from '../../contexts/PerformanceContext';

/**
 * Hook to access performance monitoring context.
 * Provides methods for marking, measuring, and tracking performance.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { mark, measure } = usePerformance();
 *
 *   useEffect(() => {
 *     mark('component:mounted');
 *     return () => {
 *       measure('component:lifetime', 'component:mounted');
 *     };
 *   }, [mark, measure]);
 * }
 * ```
 */
export function usePerformance(): PerformanceContextValue {
  const context = useContext(PerformanceContext);

  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }

  return context;
}
