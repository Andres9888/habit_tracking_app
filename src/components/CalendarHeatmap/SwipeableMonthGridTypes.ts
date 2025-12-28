/**
 * Types for SwipeableMonthGrid component
 */

import type { MonthGridProps } from './MonthGrid';

/** Direction of month navigation */
export type SwipeDirection = 'prev' | 'next';

/** Animation type for grid entry transitions */
export type GridEntryAnimation = 'none' | 'fade' | 'slideIn';

/** Props for SwipeableMonthGrid component */
export interface SwipeableMonthGridProps extends MonthGridProps {
  /** Callback when user swipes to navigate to a different month */
  onMonthChange?: (
    direction: SwipeDirection,
    newMonth: number,
    newYear: number
  ) => void;
  /** Enable or disable swipe navigation (default: true) */
  swipeEnabled?: boolean;
  /** Minimum swipe distance in pixels to trigger navigation (default: 50) */
  swipeThreshold?: number;
  /** Minimum swipe velocity to trigger navigation (default: 500) */
  velocityThreshold?: number;
  /** Optional earliest date to allow navigation to (format: YYYY-MM-DD) */
  minDate?: string;
  /** Optional latest date to allow navigation to (format: YYYY-MM-DD) */
  maxDate?: string;
  /** Disable haptic feedback (default: false) */
  disableHaptics?: boolean;
  /** Animation type for grid content when month changes (default: 'fade') */
  gridEntryAnimation?: GridEntryAnimation;
  /** Duration for grid entry animation in ms (default: 150) */
  gridEntryDuration?: number;
}
