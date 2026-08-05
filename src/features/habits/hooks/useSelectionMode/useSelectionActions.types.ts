import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';

export interface BatchUndoState {
  visible: boolean;
  habitIds: Id<'habits'>[];
  count: number;
}

export interface UseSelectionActionsArgs {
  selectedIds: Set<Id<'habits'>>;
  habits: Habit[];
  exitSelectionMode: () => void;
}

export interface UseSelectionActionsResult {
  handleBatchArchive: () => Promise<void>;
  handleBatchArchiveUndo: () => Promise<void>;
  dismissBatchArchiveUndo: () => void;
  batchArchiveUndoVisible: boolean;
  batchArchiveUndoCount: number;
  confirmDeleteVisible: boolean;
  showDeleteConfirmation: () => void;
  hideDeleteConfirmation: () => void;
  confirmBatchDelete: () => Promise<void>;
  deleteCount: number;
}
