export interface CategoryOption {
  id: string;
  icon: string;
  label: string;
}

export const CATEGORY_OPTIONS: readonly CategoryOption[] = [
  { icon: '🏃', id: 'movement', label: 'Movement' },
  { icon: '🧘', id: 'mind', label: 'Mind' },
  { icon: '☀️', id: 'morning', label: 'Morning' },
  { icon: '🌙', id: 'sleep', label: 'Sleep' },
  { icon: '💧', id: 'health', label: 'Health' },
  { icon: '🎨', id: 'craft', label: 'Craft' },
  { icon: '🎯', id: 'focus', label: 'Focus' },
  { icon: '🌱', id: 'recovery', label: 'Recovery' },
];
