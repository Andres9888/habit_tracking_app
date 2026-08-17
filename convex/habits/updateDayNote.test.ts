import { isValidDateKey } from './updateDayNote';

describe('isValidDateKey', () => {
  it.each(['2026-08-17', '2024-02-29', '1900-01-01'])(
    'accepts the canonical date %s',
    (date) => expect(isValidDateKey(date)).toBe(true)
  );

  it.each([
    '2026-02-29',
    '2026-00-10',
    '2026-13-10',
    '2026-04-31',
    '0000-01-01',
    '0001-01-01',
    '2026-8-17',
    'not-a-date',
  ])('rejects the invalid date %s', (date) => {
    expect(isValidDateKey(date)).toBe(false);
  });
});
