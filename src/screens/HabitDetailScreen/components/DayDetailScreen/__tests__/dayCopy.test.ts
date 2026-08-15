import {
  adjacentDay,
  dayRelativeLabel,
  dayStatusCopy,
  formatDayTitle,
} from '../dayCopy';

describe('dayCopy', () => {
  it('formats the title and relative label', () => {
    expect(formatDayTitle('2026-08-12')).toBe('Wednesday, August 12');
    expect(dayRelativeLabel('2026-08-15', '2026-08-15')).toBe('Today');
    expect(dayRelativeLabel('2026-08-14', '2026-08-15')).toBe('Yesterday');
    expect(dayRelativeLabel('2026-08-12', '2026-08-15')).toBe('3 days ago');
  });

  it('steps within the record and stops at the edges', () => {
    expect(adjacentDay('2026-08-12', -1, '2026-06-01', '2026-08-15')).toBe(
      '2026-08-11'
    );
    expect(
      adjacentDay('2026-06-01', -1, '2026-06-01', '2026-08-15')
    ).toBeNull();
    expect(adjacentDay('2026-08-15', 1, '2026-06-01', '2026-08-15')).toBeNull();
  });

  it('describes completed, open, and missed days', () => {
    expect(dayStatusCopy(true, false, '7:06 AM')).toEqual({
      subtitle: 'Logged at 7:06 AM',
      title: 'Completed',
    });
    expect(dayStatusCopy(false, true).title).toBe('Not logged yet');
    expect(dayStatusCopy(false, false).title).toBe('No entry');
  });
});
