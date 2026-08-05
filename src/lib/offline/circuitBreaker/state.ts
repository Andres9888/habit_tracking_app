/**
 * Circuit Breaker State Management
 */

import type { CircuitBreakerConfig, CircuitState } from '../types';

export interface CircuitStateData {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  openedAt?: number;
  lastFailureAt?: number;
}

export function createInitialState(): CircuitStateData {
  return { failureCount: 0, state: 'closed', successCount: 0 };
}

export function transitionState(
  current: CircuitStateData,
  newState: CircuitState
): CircuitStateData {
  if (newState === 'closed') {
    return { failureCount: 0, state: 'closed', successCount: 0 };
  }
  if (newState === 'open') {
    return { ...current, openedAt: Date.now(), state: 'open', successCount: 0 };
  }
  if (newState === 'half-open') {
    return { ...current, state: 'half-open', successCount: 0 };
  }
  return current;
}

export function shouldTransitionToHalfOpen(
  state: CircuitStateData,
  config: CircuitBreakerConfig
): boolean {
  return (
    state.state === 'open' &&
    state.openedAt !== undefined &&
    Date.now() - state.openedAt >= config.resetTimeoutMs
  );
}

export function shouldTransitionToClosed(
  state: CircuitStateData,
  config: CircuitBreakerConfig
): boolean {
  return (
    state.state === 'half-open' && state.successCount >= config.successThreshold
  );
}

export function shouldTransitionToOpen(
  state: CircuitStateData,
  config: CircuitBreakerConfig
): boolean {
  return (
    state.state === 'closed' && state.failureCount >= config.failureThreshold
  );
}
