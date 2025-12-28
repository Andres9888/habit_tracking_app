/**
 * ChainConnection Module
 * Streak chain visualization components for CalendarHeatmap
 */

// Components
export { ChainConnectionOverlay } from './ChainConnectionOverlay';
export { OptimizedChainConnectionOverlay } from './OptimizedChainConnectionOverlay';
export { ConnectionPath } from './ConnectionPath';
export { BatchedConnectionPath } from './BatchedConnectionPath';
export { BreakIndicator } from './BreakIndicator';

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
  // Break indicator utilities
  DEFAULT_BREAK_INDICATOR_CONFIG,
  detectStreakBreaks,
  generateBreakPath,
  calculateBreakCenter,
} from './utils';

// Types
export type {
  CalendarViewMode,
  StreakStrength,
  StreakSegment,
  StreakBreak,
  GridPosition,
  ChainConnection,
  ConnectionPathType,
  ConnectionConfig,
  BreakIndicatorConfig,
  BreakIndicatorProps,
  GridData,
  StrengthConfig,
  StreakProgressionGradient,
  ChainConnectionOverlayProps,
  ConnectionPathProps,
  UseStreakChainReturn,
} from './types';
