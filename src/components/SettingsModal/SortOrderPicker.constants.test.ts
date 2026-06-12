import {
  getSortFamily,
  getSortDirectionLabel,
  isAscending,
  modeFromFamily,
  SORT_DIRECTION_LABELS,
  toggleDirection,
} from './SortOrderPicker.constants';
import type { HabitSortMode } from '../../features/habits/types';

const ALL_MODES: HabitSortMode[] = [
  'manual',
  'name_asc',
  'name_desc',
  'strength_asc',
  'strength_desc',
  'streak_asc',
  'streak_desc',
];

describe('SortOrderPicker.constants', () => {
  it('maps every mode to its family', () => {
    expect(ALL_MODES.map(getSortFamily)).toEqual([
      'manual',
      'name',
      'name',
      'strength',
      'strength',
      'streak',
      'streak',
    ]);
  });

  it('reports direction for every mode', () => {
    expect(ALL_MODES.map(isAscending)).toEqual([
      true,
      true,
      false,
      true,
      false,
      true,
      false,
    ]);
  });

  it('round-trips every mode through family + direction', () => {
    for (const mode of ALL_MODES) {
      expect(modeFromFamily(getSortFamily(mode), isAscending(mode))).toBe(mode);
    }
  });

  it('ignores direction for manual', () => {
    expect(modeFromFamily('manual', false)).toBe('manual');
  });

  it('toggles direction within the same family', () => {
    expect(toggleDirection('name_asc')).toBe('name_desc');
    expect(toggleDirection('strength_desc')).toBe('strength_asc');
    expect(toggleDirection('manual')).toBe('manual');
  });

  it('maps context-aware direction labels per family', () => {
    expect(SORT_DIRECTION_LABELS.name).toEqual({ asc: 'A → Z', desc: 'Z → A' });
    expect(SORT_DIRECTION_LABELS.strength).toEqual({
      asc: 'Weakest first',
      desc: 'Strongest first',
    });
    expect(SORT_DIRECTION_LABELS.streak).toEqual({
      asc: 'Shortest first',
      desc: 'Longest first',
    });
    expect(getSortDirectionLabel('manual', true)).toBeNull();
    expect(getSortDirectionLabel('name', true)).toBe('A → Z');
    expect(getSortDirectionLabel('strength', false)).toBe('Strongest first');
  });
});
