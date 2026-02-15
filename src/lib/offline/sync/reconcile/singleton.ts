/**
 * State Reconciler Singleton
 *
 * Provides global access to a single StateReconciler instance.
 */

import type { ReconciliationConfig } from './types';
import { StateReconciler } from './reconciler';

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
