/**
 * PinchToZoom Types
 * TypeScript interfaces for pinch-to-zoom view transitions
 */

import type { CalendarViewMode } from './ChainConnection/types';

export type { CalendarViewMode };

/**
 * View mode zoom order (most detailed → least detailed)
 * Used to determine zoom direction and available transitions
 */
export const VIEW_ZOOM_ORDER: CalendarViewMode[] = [
  'week', // Most zoomed in (largest cells, least data)
  'month', // Medium zoom
  '3m', // Less zoomed
  'year', // Most zoomed out (smallest cells, most data)
];

/**
 * Human-readable labels for each view mode
 */
export const VIEW_MODE_LABELS: Record<CalendarViewMode, string> = {
  week: 'Week',
  month: 'Month',
  '3m': '3 Months',
  year: 'Year',
};

/**
 * Direction of zoom transition
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Props for PinchToZoomContainer component
 */
export interface PinchToZoomContainerProps {
  /** Current view mode */
  currentView: CalendarViewMode;

  /** Callback when view mode should change */
  onViewChange: (newView: CalendarViewMode, direction: ZoomDirection) => void;

  /** Whether pinch gestures are enabled (default: true) */
  pinchEnabled?: boolean;

  /** Scale threshold to trigger view transition (default: 0.7 for zoom out, 1.5 for zoom in) */
  pinchOutThreshold?: number;
  pinchInThreshold?: number;

  /** Whether the year view requires premium (blocks zoom out beyond 3m) */
  isPremium?: boolean;

  /** Callback when non-premium user tries to zoom to year view */
  onPremiumUpsell?: () => void;

  /** Disable haptic feedback (default: false) */
  disableHaptics?: boolean;

  /** Children to render inside the gesture container */
  children: React.ReactNode;
}

/**
 * Get the next view mode when zooming in (more detail)
 * @returns The next view mode or null if already at most zoomed in
 */
export function getZoomInView(
  currentView: CalendarViewMode
): CalendarViewMode | null {
  const currentIndex = VIEW_ZOOM_ORDER.indexOf(currentView);
  if (currentIndex <= 0) return null; // Already at most zoomed in (week)
  return VIEW_ZOOM_ORDER[currentIndex - 1];
}

/**
 * Get the next view mode when zooming out (less detail, more data)
 * @returns The next view mode or null if already at most zoomed out
 */
export function getZoomOutView(
  currentView: CalendarViewMode
): CalendarViewMode | null {
  const currentIndex = VIEW_ZOOM_ORDER.indexOf(currentView);
  if (currentIndex >= VIEW_ZOOM_ORDER.length - 1) return null; // Already at most zoomed out (year)
  return VIEW_ZOOM_ORDER[currentIndex + 1];
}

/**
 * Check if zoom in is available from current view
 */
export function canZoomIn(currentView: CalendarViewMode): boolean {
  return getZoomInView(currentView) !== null;
}

/**
 * Check if zoom out is available from current view
 * @param isPremium - Whether the user has premium access (year view requires premium)
 */
export function canZoomOut(
  currentView: CalendarViewMode,
  isPremium = true
): boolean {
  const nextView = getZoomOutView(currentView);
  if (nextView === null) return false;
  // Year view requires premium
  if (nextView === 'year' && !isPremium) return false;
  return true;
}
