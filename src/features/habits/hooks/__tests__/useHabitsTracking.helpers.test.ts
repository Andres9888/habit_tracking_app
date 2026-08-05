import { buildCompletedDatesByHabit } from '../useHabitsTracking.completions';
import { buildTrackingQueryArgs } from '../useHabitsTracking.helpers';

describe('buildTrackingQueryArgs', () => {
  it('keeps ascending endpoints as-is', () => {
    expect(buildTrackingQueryArgs('2026-04-07', '2026-07-06')).toEqual({
      endDate: '2026-07-06',
      startDate: '2026-04-07',
    });
  });

  it('orders descending endpoints', () => {
    expect(buildTrackingQueryArgs('2026-07-06', '2026-04-07')).toEqual({
      endDate: '2026-07-06',
      startDate: '2026-04-07',
    });
  });
});

describe('buildCompletedDatesByHabit', () => {
  const tracking = [
    { completed: true, date: '2026-07-05', habitId: 'h1' },
    { completed: true, date: '2026-07-06', habitId: 'h1' },
    { completed: false, date: '2026-07-04', habitId: 'h1' },
    { completed: true, date: '2026-07-06', habitId: 'h2' },
  ];

  it('maps completed tracking rows so week cells resolve to done', () => {
    const map = buildCompletedDatesByHabit(tracking, new Map());

    expect(map.get('h1')?.has('2026-07-05')).toBe(true);
    expect(map.get('h1')?.has('2026-07-06')).toBe(true);
    expect(map.get('h1')?.has('2026-07-04')).toBe(false);
    expect(map.get('h2')?.has('2026-07-06')).toBe(true);
  });

  it('overlays pending toggles on top of server rows', () => {
    const pending = new Map<string, boolean>([
      ['h1:2026-07-06', false],
      ['h3:2026-07-06', true],
    ]);
    const map = buildCompletedDatesByHabit(tracking, pending);

    expect(map.get('h1')?.has('2026-07-06')).toBe(false);
    expect(map.get('h3')?.has('2026-07-06')).toBe(true);
  });
});
