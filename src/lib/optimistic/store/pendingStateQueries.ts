import type { OptimisticStore } from '../types';

export function countPendingOperations(state: OptimisticStore): number {
  let count = 0;
  for (const operation of state.operations.values()) {
    if (operation.state === 'pending') count++;
  }
  return count;
}

export function hasPendingOperations(state: OptimisticStore): boolean {
  for (const operation of state.operations.values()) {
    if (operation.state === 'pending') return true;
  }
  return false;
}
