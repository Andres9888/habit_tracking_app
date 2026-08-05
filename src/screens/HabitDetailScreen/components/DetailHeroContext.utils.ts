/**
 * getHeroContext — Pure function: habit streak/goal state → one notable line.
 *
 * Returns null when nothing is worth surfacing, so the hero shows no filler
 * badge. Priority: goal reached → personal-best streak → progress toward goal
 * → ongoing streak.
 */

export type HeroContextTone = 'streak' | 'goal';

export interface HeroContext {
  emoji: string;
  text: string;
  tone: HeroContextTone;
  /** True for milestone celebrations (e.g. goal reached) — rendered in amber/gold. */
  milestone?: boolean;
}

export interface HeroContextInput {
  currentStreak?: number;
  bestStreak?: number;
  goalDuration?: number;
}

const MIN_STREAK = 3;

export function getHeroContext({
  currentStreak = 0,
  bestStreak = 0,
  goalDuration = 0,
}: HeroContextInput): HeroContext | null {
  const hasGoal = goalDuration > 0;

  if (hasGoal && currentStreak >= goalDuration) {
    return { emoji: '🏆', text: 'Goal reached', tone: 'goal', milestone: true };
  }

  if (currentStreak >= MIN_STREAK && currentStreak >= bestStreak) {
    return { emoji: '🔥', text: 'Longest streak yet', tone: 'streak' };
  }

  if (hasGoal) {
    const remaining = goalDuration - currentStreak;
    const unit = remaining === 1 ? 'day' : 'days';
    return {
      emoji: '🎯',
      text: `${remaining} ${unit} to your ${goalDuration}-day goal`,
      tone: 'goal',
    };
  }

  if (currentStreak >= MIN_STREAK) {
    return { emoji: '🔥', text: `${currentStreak}-day streak`, tone: 'streak' };
  }

  return null;
}
