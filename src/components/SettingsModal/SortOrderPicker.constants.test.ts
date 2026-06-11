import {
  getSortFamily,
  isAscending,
  modeFromFamily,
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
});
