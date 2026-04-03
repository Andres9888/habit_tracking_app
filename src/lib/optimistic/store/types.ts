/**
 * Types for optimistic update store
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import type {
  OptimisticOperation,
  OptimisticStore,
  ToggleOperationPayload,
  ArchiveOperationPayload,
  ReorderOperationPayload,
  PauseOperationPayload,
} from '../types';

export type StoreListener = () => void;

export interface OptimisticStoreAPI {
  subscribe(listener: StoreListener): () => void;
  getSnapshot(): OptimisticStore;
  addToggle(payload: ToggleOperationPayload): string;
  addArchive(payload: ArchiveOperationPayload): string;
  addReorder(payload: ReorderOperationPayload): string;
  addPause(payload: PauseOperationPayload): string;
  confirm(operationId: string): void;
  fail(operationId: string, error: Error): void;
  reset(): void;
  clearPendingState(operation: OptimisticOperation): void;
  getPendingToggle(habitId: Id<'habits'>, date: string): boolean | undefined;
  getPendingArchive(habitId: Id<'habits'>): boolean | undefined;
  getPendingReorder(): Id<'habits'>[] | null;
  getPendingPause(habitId: Id<'habits'>): boolean | undefined;
  hasPendingOperations(): boolean;
  getPendingCount(): number;
}
