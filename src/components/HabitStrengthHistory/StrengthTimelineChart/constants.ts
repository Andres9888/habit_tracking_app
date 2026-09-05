import { durations } from '@/theme/animations';
/**
 * Constants for StrengthTimelineChart
 */

// Chart dimensions and styling constants
export const DEFAULT_HEIGHT = 120;
export const PADDING_LEFT = 12;
export const PADDING_RIGHT = 12;
export const PADDING_TOP = 16;
export const PADDING_BOTTOM = 24;
export const GRID_LINE_COUNT = 3; // 0%, 50%, 100% lines

// Animation constants
export const PATH_ANIMATION_DURATION = durations.complex;
export const PATH_DRAW_DELAY = durations.standard;
export const PULSE_DURATION = durations.breathing;
export const DOT_RADIUS = 5;
export const ESTIMATED_PATH_LENGTH = 1500; // Approximate max path length for animation

// Default emerald color if none provided (WCAG AA compliant)
export const DEFAULT_CHART_COLOR = '#047857'; // Emerald-700 (WCAG AA: 5.48:1)

// Minimum history length to show full chart
export const MIN_HISTORY_LENGTH = 7;
