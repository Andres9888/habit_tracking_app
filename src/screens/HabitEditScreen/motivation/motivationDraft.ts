import type { Habit } from '../../../features/habits/types';
import type { MotivationFieldKey } from '../../../../convex/habits/validateMotivationFields';

export type MotivationDraft = Record<MotivationFieldKey, string>;

export function emptyMotivation(): MotivationDraft {
  return {
    identity: '',
    why: '',
    woopObstacle: '',
    woopOutcome: '',
    woopPlan: '',
    woopWish: '',
  };
}

export function motivationFromHabit(habit?: Habit | null): MotivationDraft {
  return {
    identity: habit?.identity ?? '',
    why: habit?.why ?? '',
    woopObstacle: habit?.woopObstacle ?? '',
    woopOutcome: habit?.woopOutcome ?? '',
    woopPlan: habit?.woopPlan ?? '',
    woopWish: habit?.woopWish ?? '',
  };
}
