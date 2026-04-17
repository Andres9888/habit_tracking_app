import type { StarterChip } from './HabitsEmptyState.types';
import type { TimeBucket } from './useTimeBucket';

const MORNING: StarterChip[] = [
  { emoji: '☕', name: 'Morning coffee' },
  { emoji: '🏃', name: 'Morning run' },
  { emoji: '🧘', name: 'Meditate' },
  { emoji: '📚', name: 'Read' },
  { emoji: '💧', name: 'Drink water' },
];

const AFTERNOON: StarterChip[] = [
  { emoji: '🚶', name: 'Afternoon walk' },
  { emoji: '💧', name: 'Drink water' },
  { emoji: '📚', name: 'Read' },
  { emoji: '🧘', name: 'Meditate' },
  { emoji: '🍎', name: 'Eat fruit' },
];

const EVENING: StarterChip[] = [
  { emoji: '📖', name: 'Night reading' },
  { emoji: '🧘', name: 'Meditate' },
  { emoji: '📓', name: 'Journal' },
  { emoji: '💧', name: 'Drink water' },
  { emoji: '🛌', name: 'Wind down' },
];

export function chipsFor(bucket: TimeBucket): StarterChip[] {
  if (bucket === 'afternoon') return AFTERNOON;
  if (bucket === 'evening') return EVENING;
  return MORNING;
}
