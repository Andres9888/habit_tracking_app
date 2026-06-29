import { applyPendingTogglesToTracking } from '../applyPendingTogglesToTracking';

type Entry = { completed: boolean; date: string; habitId: string };

const make = (habitId: string, date: string, completed: boolean): Entry => ({
  completed,
  date,
  habitId,
});

describe('applyPendingTogglesToTracking', () => {
  const tracking: Entry[] = [
    { habitId: 'h1', date: '2026-06-20', completed: true },
    { habitId: 'h1', date: '2026-06-21', completed: false },
    { habitId: 'h2', date: '2026-06-20', completed: true },
  ];

  it('returns the same reference when nothing is pending', () => {
    const result = applyPendingTogglesToTracking(tracking, new Map(), make);
    expect(result).toBe(tracking);
  });

  it('flips an existing entry without mutating the input', () => {
    const pending = new Map([['h1:2026-06-21', true]]);
    const result = applyPendingTogglesToTracking(tracking, pending, make);
    expect(result).not.toBe(tracking);
    expect(result.find((e) => e.habitId === 'h1' && e.date === '2026-06-21')?.completed).toBe(true);
    // original untouched
    expect(tracking[1].completed).toBe(false);
  });

  it('appends a synthetic entry for a date with no server record', () => {
    const pending = new Map([['h1:2026-06-22', true]]);
    const result = applyPendingTogglesToTracking(tracking, pending, make);
    expect(result).toHaveLength(tracking.length + 1);
    expect(result.find((e) => e.date === '2026-06-22')).toEqual(make('h1', '2026-06-22', true));
  });

  it('leaves unrelated habits untouched', () => {
    const pending = new Map([['h1:2026-06-20', false]]);
    const result = applyPendingTogglesToTracking(tracking, pending, make);
    expect(result.find((e) => e.habitId === 'h2' && e.date === '2026-06-20')?.completed).toBe(true);
  });
});
