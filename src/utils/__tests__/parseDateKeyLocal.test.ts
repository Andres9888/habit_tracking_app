import { formatDateKeyLabel, parseDateKeyLocal } from '../getLocalDateString';

describe('parseDateKeyLocal', () => {
  it('keeps the calendar day instead of parsing YYYY-MM-DD as UTC', () => {
    const parsed = parseDateKeyLocal('2026-01-15');
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(0);
    expect(parsed.getDate()).toBe(15);
  });

  it('formats streak-record labels from the calendar day', () => {
    expect(
      formatDateKeyLabel('2026-01-15', { day: 'numeric', month: 'short' })
    ).toBe('Jan 15');
  });
});
