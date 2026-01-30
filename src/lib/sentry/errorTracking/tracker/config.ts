/**
 * Error Tracker Configuration
 */

import type { ErrorTrackerConfig } from '../types';
import { DEFAULT_ERROR_TRACKER_CONFIG } from '../types';

/** Configuration state */
let config: ErrorTrackerConfig = { ...DEFAULT_ERROR_TRACKER_CONFIG };

/** Configure the error tracker */
export function configureErrorTracker(
  newConfig: Partial<ErrorTrackerConfig>
): void {
  config = { ...DEFAULT_ERROR_TRACKER_CONFIG, ...newConfig };
}

/** Get current configuration */
export function getConfig(): ErrorTrackerConfig {
  return config;
}
