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
  getPendingTogglesSnapshot(): Map<string, boolean>;
  addToggle(payload: ToggleOperationPayload): string;
  addArchive(payload: ArchiveOperationPayload): string;
  addReorder(payload: ReorderOperationPayload): string;
  addPause(payload: PauseOperationPayload): string;
  addArchiveWithId(id: string, payload: ArchiveOperationPayload): string;
  addPauseWithId(id: string, payload: PauseOperationPayload): string;
  addReorderWithId(id: string, payload: ReorderOperationPayload): string;
  addToggleWithId(id: string, payload: ToggleOperationPayload): string;
  replaceOperationId(oldId: string, newId: string): void;
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
