/** Copy tiers for the trial bar, escalating urgency as time runs out */

interface TrialBarCopy {
  headline: string;
  cta: string;
  gradient: readonly [string, string];
}

const GRADIENT_WARM = ['#f59e0b', '#f97316'] as const;
const GRADIENT_HOT = ['#f97316', '#ef4444'] as const;
const GRADIENT_URGENT = ['#ef4444', '#dc2626'] as const;

export function getTrialBarCopy(daysRemaining: number): TrialBarCopy {
  if (daysRemaining <= 1) {
    return {
      cta: 'Upgrade now',
      gradient: GRADIENT_URGENT,
      headline: 'Last day — keep your streaks forever',
    };
  }
  if (daysRemaining <= 3) {
    return {
      cta: 'Go Pro',
      gradient: GRADIENT_HOT,
      headline: `Only ${daysRemaining} days left to lock in your progress`,
    };
  }
  return {
    cta: `${daysRemaining} days left`,
    gradient: GRADIENT_WARM,
    headline: 'Your streaks deserve protection',
  };
}
