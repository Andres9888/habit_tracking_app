/**
 * BinaryHeatmap Utilities
 *
 * Grid generation, calculations, and formatting utilities for the binary heatmap.
 * Split into focused modules for better maintainability.
 */

// Grid generation
export { generateBinaryGrid } from './grid-generation';

// Calculations
export {
  getTimeRangeDays,
  getCellState,
  calculateBinaryGridStats,
  getTotalCellCount,
  calculateCellAnimationDelay,
} from './calculations';

// Formatting
export {
  formatDateForAccessibility,
  getBinaryCellAccessibilityLabel,
  formatTooltipText,
  isValidDateString,
  formatDateString,
} from './formatting';
