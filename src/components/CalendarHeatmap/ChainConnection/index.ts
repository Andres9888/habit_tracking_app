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
  // Progression gradient utilities
  DEFAULT_PROGRESSION_GRADIENT,
  calculateProgressionFactor,
  interpolateValue,
  calculateProgressionOpacity,
  calculateProgressionThickness,
  calculateProgressionColor,
  hexToHSL,
  hslToHex,
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
  StreakProgressionGradient,
  ChainConnectionOverlayProps,
  ConnectionPathProps,
  UseStreakChainReturn,
} from './types';
