/** Sort family + direction helpers for inline SortOrderPicker */
import type { HabitSortMode } from '../../features/habits/types';

export type SortFamily = 'manual' | 'name' | 'strength' | 'streak';

export const SORT_FAMILIES: { key: SortFamily; label: string }[] = [
  { key: 'manual', label: 'Manual' },
  { key: 'name', label: 'Name' },
  { key: 'strength', label: 'Strength' },
  { key: 'streak', label: 'Chain' },
];

type SortableFamily = Exclude<SortFamily, 'manual'>;

export const SORT_DIRECTION_LABELS: Record<
  SortableFamily,
  { asc: string; desc: string }
> = {
  name: { asc: 'A → Z', desc: 'Z → A' },
  strength: { asc: 'Weakest first', desc: 'Strongest first' },
  streak: { asc: 'Shortest first', desc: 'Longest first' },
};

export function getSortDirectionLabel(
  family: SortFamily,
  ascending: boolean
): string | null {
  if (family === 'manual') return null;
  return SORT_DIRECTION_LABELS[family][ascending ? 'asc' : 'desc'];
}

export function getSortFamily(mode: HabitSortMode): SortFamily {
  if (mode === 'manual') return 'manual';
  if (mode.startsWith('name')) return 'name';
  if (mode.startsWith('strength')) return 'strength';
  return 'streak';
}

export function isAscending(mode: HabitSortMode): boolean {
  return mode.endsWith('_asc') || mode === 'manual';
}

export function modeFromFamily(
  family: SortFamily,
  ascending: boolean
): HabitSortMode {
  if (family === 'manual') return 'manual';
  const dir = ascending ? 'asc' : 'desc';
  return `${family}_${dir}` as HabitSortMode;
}

export function toggleDirection(mode: HabitSortMode): HabitSortMode {
  const family = getSortFamily(mode);
  if (family === 'manual') return mode;
  return modeFromFamily(family, !isAscending(mode));
}
