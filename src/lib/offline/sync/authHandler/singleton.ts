/**
 * Auth Handler Singleton
 *
 * Global singleton instance for auth handler to coordinate sync across the app.
 */

import type { AuthHandlerConfig, AuthHandlerDeps } from './types';
import { createAuthHandler, type AuthHandlerAPI } from './authHandler';

let instance: AuthHandlerAPI | null = null;

/**
 * Get or create the global auth handler instance
 */
export function getAuthHandler(
  deps?: AuthHandlerDeps,
  config?: AuthHandlerConfig
): AuthHandlerAPI {
  if (!instance) {
    if (!deps) {
      // Create with noop deps if none provided (for testing/SSR)
      deps = { isAuthenticated: () => true };
    }
    instance = createAuthHandler(deps, config);
  }
  return instance;
}

/**
 * Reset the global auth handler instance (for testing)
 */
export function resetAuthHandler(): void {
  if (instance) {
    instance.reset();
  }
  instance = null;
}

/**
 * Check if auth handler has been initialized
 */
export function hasAuthHandler(): boolean {
  return instance !== null;
}
