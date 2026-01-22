/**
 * Performance Dashboard
 * Dev-only performance monitoring dashboard component.
 *
 * @example
 * ```tsx
 * // In your root App component
 * import { PerformanceDashboard } from '@/components/PerformanceDashboard';
 *
 * function App() {
 *   return (
 *     <>
 *       <MainContent />
 *       <PerformanceDashboard />
 *     </>
 *   );
 * }
 * ```
 */

export { PerformanceDashboard, default } from './PerformanceDashboard';
export { useDashboardData } from './useDashboardData';
export type {
  DashboardConfig,
  DashboardState,
  DashboardTab,
  FPSData,
  MemoryData,
  NetworkData,
  RenderData,
  StatusLevel,
} from './types';
