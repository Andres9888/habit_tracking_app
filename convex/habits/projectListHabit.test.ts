import { projectHabitForList } from './projectListHabit';
import type { Doc } from '../_generated/dataModel';

function makeHabit(
  overrides: Partial<Doc<'habits'>> & { _id: Doc<'habits'>['_id'] }
): Doc<'habits'> {
  return {
    _creationTime: 1,
    archived: true,
    archivedAt: 99,
    createdAt: 2,
    name: 'Run',
    notes: 'private journal',
    why: 'drop this from list payloads',
    woopWish: 'also dropped',
    ...overrides,
  } as Doc<'habits'>;
}

describe('projectHabitForList', () => {
  it('keeps list/archive UI fields and drops motivation/viz payloads', () => {
    const projected = projectHabitForList(
      makeHabit({ _id: 'habits:1' as Doc<'habits'>['_id'] })
    );

    expect(projected.name).toBe('Run');
    expect(projected.archivedAt).toBe(99);
    expect(projected).not.toHaveProperty('notes');
    expect(projected).not.toHaveProperty('why');
    expect(projected).not.toHaveProperty('woopWish');
  });
});
