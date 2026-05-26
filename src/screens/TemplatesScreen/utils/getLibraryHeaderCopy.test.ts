import { getLibraryHeaderCopy } from './getLibraryHeaderCopy';

describe('getLibraryHeaderCopy', () => {
  it('uses goal-first copy for first-time users', () => {
    const copy = getLibraryHeaderCopy(true, 0);
    expect(copy.title).toBe('What do you want to work on?');
    expect(copy.subtitle).toContain('transformation');
  });

  it('highlights session progress for returning users', () => {
    const copy = getLibraryHeaderCopy(false, 2);
    expect(copy.title).toBe('Habit Library');
    expect(copy.subtitle).toContain('2 habits added');
  });

  it('uses default library copy for returning users without session imports', () => {
    const copy = getLibraryHeaderCopy(false, 0);
    expect(copy.title).toBe('Habit Library');
    expect(copy.subtitle).toContain('Search');
  });
});
