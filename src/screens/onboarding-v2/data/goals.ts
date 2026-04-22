export interface GoalOption {
  id: string;
  icon: string;
  label: string;
  sub: string;
}

export const GOAL_OPTIONS: readonly GoalOption[] = [
  {
    icon: '🏃',
    id: 'movement',
    label: 'Movement',
    sub: 'Walks, stretching, workouts',
  },
  {
    icon: '🧘',
    id: 'mind',
    label: 'Mind',
    sub: 'Meditation, journaling, reading',
  },
  {
    icon: '☀️',
    id: 'morning',
    label: 'Morning routine',
    sub: 'A start-the-day ritual',
  },
  {
    icon: '🌙',
    id: 'sleep',
    label: 'Sleep',
    sub: 'Winding down, off the phone',
  },
  {
    icon: '💧',
    id: 'health',
    label: 'Health',
    sub: 'Water, food, medication',
  },
  {
    icon: '🎨',
    id: 'craft',
    label: 'Craft',
    sub: 'Writing, practice, learning',
  },
  {
    icon: '🌱',
    id: 'recovery',
    label: 'Recovery',
    sub: 'Rebuilding after a rough patch',
  },
];
