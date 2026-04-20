/**
 * useResolveWhy — Picks the best motivation field to display.
 * Priority: why → identity → woopWish.
 */
import type { Habit } from '../../../../features/habits/types';

export type WhySource = 'why' | 'identity' | 'woopWish';

export interface ResolvedWhy {
  source: WhySource;
  label: string;
  icon: string;
  value: string;
}

const LABELS: Record<WhySource, { label: string; icon: string }> = {
  identity: { icon: '🌱', label: 'Who you\'re becoming' },
  why: { icon: '💭', label: 'Your why' },
  woopWish: { icon: '⭐', label: 'Your wish' },
};

function trim(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function useResolveWhy(habit: Habit): ResolvedWhy | null {
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
