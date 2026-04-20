export interface GoalOption {
  id: string;
  emoji: string;
  label: string;
}

export const GOAL_OPTIONS: GoalOption[] = [
  { id: 'consistency', emoji: '🔗', label: 'Build consistent routines' },
  { id: 'health', emoji: '💪', label: 'Improve my physical health' },
  { id: 'stress', emoji: '🧘', label: 'Reduce stress and anxiety' },
  { id: 'productivity', emoji: '🎯', label: 'Focus better, do more' },
  { id: 'sleep', emoji: '😴', label: 'Sleep and recover well' },
  { id: 'learning', emoji: '📚', label: 'Learn something new' },
  { id: 'other', emoji: '✨', label: "Something else" },
];
