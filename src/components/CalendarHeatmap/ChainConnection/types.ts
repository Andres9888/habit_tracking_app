/**
 * ChainConnection Types
 * TypeScript interfaces for streak chain visualization
 */

/**
 * Calendar view mode options
 */
export type CalendarViewMode = 'week' | 'month' | '3m' | 'year';

/**
 * Strength tier for visual rendering
 * Based on HabitChainVisualizer's established strength system
 */
export type StreakStrength =
  | 'subtle' // 1-2 days
  | 'growing' // 3-4 days
  | 'strong' // 5-6 days
  | 'very-strong' // 7-13 days
  | 'legendary' // 14-20 days
  | 'legendary-plus'; // 21+ days

/**
 * Represents a contiguous streak segment within the grid
 */
export interface StreakSegment {
  /** Unique identifier for the segment */
  id: string;
  /** Start date of the streak (YYYY-MM-DD) */
  startDate: string;
  /** End date of the streak (YYYY-MM-DD) */
  endDate: string;
  /** Number of consecutive completed days */
  length: number;
  /** Array of all dates in the streak (ordered oldest→newest) */
  dates: string[];
  /** Whether this streak is currently active (ends today or yesterday) */
  isActive: boolean;
}

/**
 * Grid position for a cell
 */
export interface GridPosition {
  /** Position type based on view mode */
  type: 'horizontal' | 'month' | 'week' | 'year';
  /** Week index (column) for horizontal/year, row for month */
  primaryIndex: number;
  /** Day-of-week index (row) for horizontal/year, column for month */
  secondaryIndex: number;
  /** Pixel X coordinate (calculated during render) */
  x: number;
  /** Pixel Y coordinate (calculated during render) */
  y: number;
}

/**
 * Connection between two consecutive completed cells
 */
export interface ChainConnection {
  /** Unique identifier for the connection */
  id: string;
  /** Start date (earlier) */
  fromDate: string;
  /** End date (later) */
  toDate: string;
  /** Position of start cell */
  fromPosition: GridPosition;
  /** Position of end cell */
  toPosition: GridPosition;
  /** Position within the streak (1-indexed) */
  streakPosition: number;
  /** Total length of the containing streak */
  streakLength: number;
  /** Visual strength tier */
  strength: StreakStrength;
  /** Whether this is part of the active streak */
  isActive: boolean;
}

/**
 * Connection path type based on cell relationship
 */
export type ConnectionPathType =
  | 'horizontal' // Same row, consecutive columns
  | 'vertical' // Same column, consecutive rows
  | 'diagonal' // Different row AND column
  | 'week-wrap'; // Saturday → Sunday in horizontal/year views

/**
 * Visual configuration for connection rendering
 */
export interface ConnectionConfig {
  /** Habit's accent color (hex) */
  habitColor: string;
  /** Whether to use muted colors for historical streaks */
  useMutedColors: boolean;
  /** Whether animations should be disabled */
  reduceMotion: boolean;
  /** Cell size in pixels */
  cellSize: number;
  /** Gap between cells in pixels */
  cellGap: number;
  /** Offset for day labels (horizontal views) */
  labelOffset: number;
}

/**
 * Grid data for position calculation
 */
export interface GridData {
  /** Current view mode */
  viewMode: CalendarViewMode;
  /** Number of weeks (columns in horizontal, rows in month) */
  weekCount: number;
  /** Cell size in pixels */
  cellSize: number;
  /** Gap between cells */
  cellGap: number;
  /** Header height (for month view) */
  headerHeight: number;
  /** Day label width (for horizontal views) */
  labelWidth: number;
}

/**
 * Strength configuration for visual rendering
 * Aligned with HabitChainVisualizer patterns
 */
export interface StrengthConfig {
  /** Line height/thickness in pixels */
  height: number;
  /** Maximum opacity (0-1) */
  maxOpacity: number;
  /** Shimmer animation speed in ms (0 = no shimmer) */
  shimmerSpeed: number;
  /** Whether to use accent color (vs base color) */
  useAccent: boolean;
  /** Whether to show shadow glow */
  showShadow: boolean;
}

/**
 * Props for ChainConnectionOverlay component
 */
export interface ChainConnectionOverlayProps {
  /** Detected streak segments */
  segments: StreakSegment[];
  /** Map of date → GridPosition */
  positions: Map<string, GridPosition>;
  /** Habit's accent color (hex) */
  habitColor: string;
  /** Whether to reduce motion */
  reduceMotion: boolean;
  /** Current view mode */
  viewMode: CalendarViewMode;
  /** Grid dimensions for SVG sizing */
  gridWidth: number;
  gridHeight: number;
}

/**
 * Props for ConnectionPath component
 */
export interface ConnectionPathProps {
  /** Connection to render */
  connection: ChainConnection;
  /** Visual configuration */
  config: ConnectionConfig;
  /** Animation delay for staggered entrance */
  animationDelay: number;
}

/**
 * Return type for useStreakChain hook
 */
export interface UseStreakChainReturn {
  /** All detected streak segments */
  segments: StreakSegment[];
  /** Generated connections between cells */
  connections: ChainConnection[];
  /** Currently active streak (if any) */
  activeStreak: StreakSegment | null;
  /** Longest streak in the data */
  longestStreak: StreakSegment | null;
  /** Map of date → GridPosition */
  positions: Map<string, GridPosition>;
}
