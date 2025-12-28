/**
 * ChainConnection Module
 * Streak chain visualization components for CalendarHeatmap
 */

// Components
export { ChainConnectionOverlay } from './ChainConnectionOverlay';
export { ConnectionPath } from './ConnectionPath';

// Hook
export { useStreakChain } from './useStreakChain';

// Utilities
export {
  detectStreakSegments,
  getStrengthTier,
  getStrengthConfig,
  calculateGridPositions,
  generateConnections,
  getConnectionPathType,
  generateConnectionPath,
  getDefaultGridData,
  calculateGridDimensions,
} from './utils';

// Types
export type {
  CalendarViewMode,
  StreakStrength,
  StreakSegment,
  GridPosition,
  ChainConnection,
  ConnectionPathType,
  ConnectionConfig,
  GridData,
  StrengthConfig,
  ChainConnectionOverlayProps,
  ConnectionPathProps,
  UseStreakChainReturn,
} from './types';
