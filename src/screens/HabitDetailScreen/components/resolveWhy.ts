/**
 * Picks the one sentence Habit Detail may show.
 * Priority matches production + the full-flow mock: why → identity → wish.
 *
 * A why that still equals the source template's authored `suggestedWhy` is
 * labelled "Why it works" — it is science copy the user has not made their
 * own yet. The moment they edit it, the label becomes "Your why".
 */
import type { Habit } from '../../../features/habits/types';

export type WhySource = 'why' | 'identity' | 'woopWish';

export interface ResolvedWhy {
  icon: string;
  /** True when the why is the untouched template sentence. */
  isTemplateWhy: boolean;
  label: string;
  source: WhySource;
  value: string;
}

const LABELS: Record<WhySource, { icon: string; label: string }> = {
  identity: { icon: '🌱', label: "Who you're becoming" },
  why: { icon: '💭', label: 'Your why' },
  woopWish: { icon: '⭐', label: 'Your wish' },
};

const TEMPLATE_WHY = { icon: '🔬', label: 'Why it works' };

function trim(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveWhy(
  habit: Pick<Habit, 'identity' | 'templateWhy' | 'why' | 'woopWish'>
): ResolvedWhy | null {
  const why = trim(habit.why);
  if (why !== null) {
    const isTemplateWhy = why === trim(habit.templateWhy);
    const copy = isTemplateWhy ? TEMPLATE_WHY : LABELS.why;
    return { ...copy, isTemplateWhy, source: 'why', value: why };
  }

  const identity = trim(habit.identity);
  if (identity !== null) {
    return {
      ...LABELS.identity,
      isTemplateWhy: false,
      source: 'identity',
      value: identity,
    };
  }

  const wish = trim(habit.woopWish);
  if (wish !== null) {
    return {
      ...LABELS.woopWish,
      isTemplateWhy: false,
      source: 'woopWish',
      value: wish,
    };
  }

  return null;
}
