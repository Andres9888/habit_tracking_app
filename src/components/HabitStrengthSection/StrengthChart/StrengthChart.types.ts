/**
 * StrengthChart - Local Type Definitions
 *
 * Internal types used by chart sub-components.
 */

/** A point on the chart with x,y coordinates */
export interface ChartPoint {
  x: number;
  y: number;
}

/** Computed chart path data */
export interface ChartPathData {
  /** Mapped chart points */
  points: ChartPoint[];
  /** Last point position (for pulsing dot) */
  lastPoint: ChartPoint;
  /** SVG path 'd' attribute for the curve */
  pathD: string;
  /** SVG path 'd' attribute for the gradient fill area */
  fillPathD: string;
  /** Estimated path length (for draw animation) */
  pathLength: number;
}

/** Props for the ChartGrid component */
export interface ChartGridProps {
  /** Grid line Y positions */
  gridLines: number[];
  /** Chart width in pixels */
  chartWidth: number;
  /** Horizontal padding */
  paddingX: number;
}

/** Props for the ChartCurve component */
export interface ChartCurveProps {
  /** SVG path for gradient fill area */
  fillPathD: string;
  /** SVG path for the curve line */
  pathD: string;
  /** Curve stroke color */
  chartColor: string;
  /** Estimated path length (for animation) */
  pathLength: number;
  /** Animation progress (0-1) */
  pathProgress: { value: number };
}

/** Props for the PulsingDot component */
export interface PulsingDotProps {
  /** X coordinate */
  cx: number;
  /** Y coordinate */
  cy: number;
  /** Dot fill color */
  color: string;
  /** Animated scale value */
  dotScale: { value: number };
  /** Animated opacity value */
  dotOpacity: { value: number };
}

/** Props for the XAxisLabels component */
export interface XAxisLabelsProps {
  /** Labels to display */
  labels: string[];
  /** Height of the label area */
  height: number;
}
