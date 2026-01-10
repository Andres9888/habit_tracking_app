/**
 * HabitRankingsList Utilities
 */

import type { RankBadge } from './types';

export function getRankBadge(rank: number): RankBadge | null {
  if (rank === 1) return { color: '#FFD700', icon: '🥇' };
  if (rank === 2) return { color: '#C0C0C0', icon: '🥈' };
  if (rank === 3) return { color: '#CD7F32', icon: '🥉' };
  return null;
}
