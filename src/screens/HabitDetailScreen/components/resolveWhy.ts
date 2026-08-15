/**
 * Picks the one sentence Habit Detail may show.
 * Priority matches production + the full-flow mock: why → identity → wish.
 */
import type { Habit } from '../../../features/habits/types';

export type WhySource = 'why' | 'identity' | 'woopWish';

export interface ResolvedWhy {
  icon: string;
  label: string;
  source: WhySource;
  value: string;
}

const LABELS: Record<WhySource, { icon: string; label: string }> = {
  identity: { icon: '🌱', label: "Who you're becoming" },
  why: { icon: '💭', label: 'Your why' },
  woopWish: { icon: '⭐', label: 'Your wish' },
};

function trim(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveWhy(
  habit: Pick<Habit, 'identity' | 'why' | 'woopWish'>
): ResolvedWhy | null {
  const why = trim(habit.why);
  if (why !== null) return { ...LABELS.why, source: 'why', value: why };

  const identity = trim(habit.identity);
  if (identity !== null) {
    return { ...LABELS.identity, source: 'identity', value: identity };
  }

  const wish = trim(habit.woopWish);
  if (wish !== null) {
    return { ...LABELS.woopWish, source: 'woopWish', value: wish };
  }

  return null;
}
