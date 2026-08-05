/**
 * State Reconciler Singleton
 *
 * Provides global access to a single StateReconciler instance.
 */

import { StateReconciler } from './reconciler';
import type { ReconciliationConfig } from './types';

let reconcilerInstance: StateReconciler | null = null;

/**
 * Get the global StateReconciler instance
 */
export function getStateReconciler(
  config?: ReconciliationConfig
): StateReconciler {
  if (!reconcilerInstance) {
    reconcilerInstance = new StateReconciler(config);
  }
  return reconcilerInstance;
}

/**
 * Reset the global StateReconciler instance (useful for testing)
 */
export function resetStateReconciler(): void {
  if (reconcilerInstance) {
    reconcilerInstance.reset();
    reconcilerInstance = null;
  }
}
