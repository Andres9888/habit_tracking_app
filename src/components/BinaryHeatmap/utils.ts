/**
 * BinaryHeatmap Utilities
 *
 * Re-exports all utility functions for backwards compatibility.
 * Individual modules:
 * - gridGeneration.ts: Grid generation and statistics
 * - accessibility.ts: Accessibility labels and helpers
 * - formatters.ts: Date formatting and tooltips
 * - animationUtils.ts: Animation timing calculations
 */

// Grid generation
export { getTimeRangeDays, generateBinaryGrid } from './gridGeneration';
export { calculateBinaryGridStats } from './gridStats';

// Accessibility
export {
  getCellState,
  formatDateForAccessibility,
  getBinaryCellAccessibilityLabel,
} from './accessibility';

// Formatters
export {
  formatTooltipText,
  isValidDateString,
  formatDateString,
} from './formatters';

// Animation utilities
export {
  getTotalCellCount,
  calculateCellAnimationDelay,
} from './animationUtils';
