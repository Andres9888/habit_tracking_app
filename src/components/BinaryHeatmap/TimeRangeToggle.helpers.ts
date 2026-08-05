/**
 * Helper functions for TimeRangeToggle Component
 */

import type { TimeRange } from './types';
import { TIME_RANGE_CONFIG } from './constants';

/** Time range options in display order */
export const TIME_RANGES: TimeRange[] = ['3m', '6m', '1y'];

/** Get display label for a time range */
export function getTimeRangeLabel(range: TimeRange): string {
  return TIME_RANGE_CONFIG[range].label;
}

/** Get full accessibility label for a time range */
export function getTimeRangeAccessibilityLabel(range: TimeRange): string {
  switch (range) {
    case '3m': {
      return '3 months';
    }
    case '6m': {
      return '6 months';
    }
    case '1y': {
      return '1 year';
    }
  }
}
