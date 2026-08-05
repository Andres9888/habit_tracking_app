import { useCallback, useMemo, useState } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../types';
import type { UseSelectionModeResult } from './useSelectionMode.types';

export function useSelectionMode(habits: Habit[]): UseSelectionModeResult {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<Id<'habits'>>>(new Set());

  const habitIds = useMemo(() => habits.map((h) => h._id), [habits]);
  const selectedCount = selectedIds.size;
  const isAllSelected = selectedCount > 0 && selectedCount === habitIds.length;

  const enterSelectionMode = useCallback(() => {
    setIsSelectionMode(true);
  }, []);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const toggleSelection = useCallback((id: Id<'habits'>) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(habitIds));
  }, [habitIds]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    deselectAll,
    enterSelectionMode,
    exitSelectionMode,
    isAllSelected,
    isSelectionMode,
    selectAll,
    selectedCount,
    selectedIds,
    toggleSelection,
  };
}
