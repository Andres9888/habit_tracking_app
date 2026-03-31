import { useCallback, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';
import { triggerHaptic } from '@/utils/haptics';

export function useArchiveSelection() {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<Id<'habits'>>>(new Set());

  const enterSelectionMode = useCallback(() => {
    setSelectionMode(true);
    setSelectedIds(new Set());
    triggerHaptic('tap');
  }, []);

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const toggleSelection = useCallback((id: Id<'habits'>) => {
    triggerHaptic('selection');
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((allIds: Id<'habits'>[]) => {
    triggerHaptic('tap');
    setSelectedIds((previous) => {
      if (previous.size === allIds.length) return new Set();
      return new Set(allIds);
    });
  }, []);

  return {
    selectionMode,
    selectedIds,
    selectedCount: selectedIds.size,
    enterSelectionMode,
    exitSelectionMode,
    toggleSelection,
    selectAll,
  };
}
