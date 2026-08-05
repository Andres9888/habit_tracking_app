import { getTodayForTimezone, isFutureDate } from './utils';

function dateKeyInTz(timezone: string, dayOffset = 0): string {
  const d = new Date(Date.now() + dayOffset * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

describe('isFutureDate with timezone', () => {
  it("accepts the user's local today even when behind UTC", () => {
    // Pacific/Honolulu is UTC-10: its "today" can be the server's "yesterday".
    const tz = 'Pacific/Honolulu';
    expect(isFutureDate(dateKeyInTz(tz), tz)).toBe(false);
  });

  it("accepts the user's local today when ahead of UTC", () => {
    const tz = 'Pacific/Kiritimati'; // UTC+14
    expect(isFutureDate(dateKeyInTz(tz), tz)).toBe(false);
  });

  it("rejects the user's local tomorrow", () => {
    const tz = 'America/Los_Angeles';
    expect(isFutureDate(dateKeyInTz(tz, 1), tz)).toBe(true);
  });

  it('accepts past dates in any timezone', () => {
    expect(isFutureDate('2020-01-01', 'Asia/Tokyo')).toBe(false);
  });

  it('falls back to grace-period behavior without a timezone', () => {
    expect(isFutureDate('2020-01-01')).toBe(false);
    expect(isFutureDate('2099-01-01')).toBe(true);
  });
});

describe('getTodayForTimezone', () => {
  it('returns a YYYY-MM-DD key', () => {
    expect(getTodayForTimezone('America/New_York')).toMatch(
      /^\d{4}-\d{2}-\d{2}$/
    );
  });

  it('falls back gracefully on an invalid timezone', () => {
    expect(getTodayForTimezone('Not/AZone')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
