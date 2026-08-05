import type { Id } from '../../../../../convex/_generated/dataModel';

export interface UseSelectionModeResult {
  isSelectionMode: boolean;
  selectedIds: Set<Id<'habits'>>;
  selectedCount: number;
  isAllSelected: boolean;
  enterSelectionMode: () => void;
  exitSelectionMode: () => void;
  toggleSelection: (id: Id<'habits'>) => void;
  selectAll: () => void;
  deselectAll: () => void;
}
