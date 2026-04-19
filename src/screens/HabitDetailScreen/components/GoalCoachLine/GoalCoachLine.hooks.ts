/**
 * useCoachMessage — Pure function: progress state → coach message.
 * Six brackets based on overall percent + broken-streak detection.
 */

export type CoachTone = 'reset' | 'start' | 'build' | 'mid' | 'home' | 'done';

export interface CoachMessage {
  emoji: string;
  message: string;
  tone: CoachTone;
}

export interface CoachInput {
  currentStreak: number;
  streakGoal: number;
  bestStreak: number;
}

export function useCoachMessage({
  currentStreak,
  streakGoal,
  bestStreak,
}: CoachInput): CoachMessage {
  const percent =
    streakGoal > 0 ? Math.round((currentStreak / streakGoal) * 100) : 0;

  if (percent >= 100) {
    return { emoji: '🏆', message: 'Goal crushed. Set a new one?', tone: 'done' };
  }

  if (currentStreak === 0 && bestStreak > 0) {
    return {
      emoji: '🔁',
      message: 'Reset happens. Today is day 1 again.',
      tone: 'reset',
    };
  }

  if (percent < 10) {
    return {
      emoji: '🌱',
      message: 'First week is the hardest. Show up today.',
      tone: 'start',
    };
  }

  if (percent < 40) {
    return {
      emoji: '📈',
      message: "Momentum's on your side — keep the chain alive.",
      tone: 'build',
    };
  }

  if (percent < 70) {
    return {
      emoji: '💪',
      message: 'Past halfway. Closer to goal than the start.',
      tone: 'mid',
    };
  }

  return {
    emoji: '🔥',
    message: "Don't break the chain now.",
    tone: 'home',
  };
}
