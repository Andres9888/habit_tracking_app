import { useMemo } from 'react';
import type { ChainCellState } from './ChainGridCard.types';

/**
 * Detect end-of-streak days: a completed day immediately followed by an
 * uncompleted one (or the final completed day if no break follows).
 * The latter distinction is a "live" streak, which we do NOT ring — only
 * historical breaks get the burnished-gold ring.
 */
export function useChainCells(days: boolean[]): ChainCellState[] {
  return useMemo(() => {
    return days.map((completed, index) => {
      if (!completed) return { completed: false, isEndOfStreak: false };
      const next = days[index + 1];
      const isEndOfStreak = next === false;
      return { completed: true, isEndOfStreak };
    });
  }, [days]);
}
