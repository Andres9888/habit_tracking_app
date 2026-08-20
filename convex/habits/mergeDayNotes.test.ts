import { mergeDayNotes } from './mergeDayNotes';

describe('mergeDayNotes', () => {
  it('keeps leftover tracking notes when habitDayNotes has no row', () => {
    expect(
      mergeDayNotes([], [{ date: '2026-08-06', note: 'Bbb' }])
    ).toEqual([{ date: '2026-08-06', note: 'Bbb' }]);
  });

  it('lets habitDayNotes win over a leftover tracking note', () => {
    expect(
      mergeDayNotes(
        [{ date: '2026-08-06', note: 'Updated' }],
        [{ date: '2026-08-06', note: 'Bbb' }]
      )
    ).toEqual([{ date: '2026-08-06', note: 'Updated' }]);
  });

  it('ignores blank leftover tracking notes', () => {
    expect(
      mergeDayNotes([], [{ date: '2026-08-06', note: '   ' }])
    ).toEqual([]);
  });
});
