import {
  getNextReminderRelativeTime,
  createDateFromTimeString,
  formatReminderTime,
} from '../notifications';

// Mock the current time for deterministic tests
const mockNow = (dateString: string) => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(dateString));
};

const restoreTime = () => {
  jest.useRealTimers();
};

describe('getNextReminderRelativeTime', () => {
  afterEach(() => {
    restoreTime();
  });

  it('returns null when reminderTime is undefined', () => {
    expect(getNextReminderRelativeTime(undefined)).toBeNull();
  });

  it('returns null when reminderTime is empty string', () => {
    expect(getNextReminderRelativeTime('')).toBeNull();
  });

  it('shows relative hours when reminder is today and hours away', () => {
    // Current time: 10:00 AM, reminder at 2:00 PM (4 hours away)
    mockNow('2025-12-21T10:00:00');
    const result = getNextReminderRelativeTime('2:00 PM');
    expect(result).toBe('In 4 hours');
  });

  it('shows relative hours and minutes when reminder is today', () => {
    // Current time: 10:00 AM, reminder at 2:30 PM (4h 30m away)
    mockNow('2025-12-21T10:00:00');
    const result = getNextReminderRelativeTime('2:30 PM');
    expect(result).toBe('In 4h 30m');
  });

  it('shows relative minutes when reminder is less than an hour away', () => {
    // Current time: 1:15 PM, reminder at 2:00 PM (45 minutes away)
    mockNow('2025-12-21T13:15:00');
    const result = getNextReminderRelativeTime('2:00 PM');
    expect(result).toBe('In 45 minutes');
  });

  it('shows "In 1 minute" for singular minute', () => {
    // Current time: 1:59 PM, reminder at 2:00 PM (1 minute away)
    mockNow('2025-12-21T13:59:00');
    const result = getNextReminderRelativeTime('2:00 PM');
    expect(result).toBe('In 1 minute');
  });

  it('shows "In 1 hour" for singular hour', () => {
    // Current time: 1:00 PM, reminder at 2:00 PM (1 hour away)
    mockNow('2025-12-21T13:00:00');
    const result = getNextReminderRelativeTime('2:00 PM');
    expect(result).toBe('In 1 hour');
  });

  it('shows "Tomorrow at X" when reminder time has passed today', () => {
    // Current time: 3:00 PM, reminder at 2:00 PM (already passed, next is tomorrow)
    mockNow('2025-12-21T15:00:00');
    const result = getNextReminderRelativeTime('2:00 PM');
    expect(result).toBe('Tomorrow at 2pm');
  });

  it('shows "Tomorrow at X" with minutes when applicable', () => {
    // Current time: 3:00 PM, reminder at 2:30 PM (already passed, next is tomorrow)
    mockNow('2025-12-21T15:00:00');
    const result = getNextReminderRelativeTime('2:30 PM');
    expect(result).toBe('Tomorrow at 2:30pm');
  });

  it('handles 24-hour format input', () => {
    // Current time: 10:00, reminder at 14:00 (4 hours away)
    mockNow('2025-12-21T10:00:00');
    const result = getNextReminderRelativeTime('14:00');
    expect(result).toBe('In 4 hours');
  });

  it('handles morning reminders correctly', () => {
    // Current time: 10:00 PM, reminder at 8:00 AM (next is tomorrow)
    mockNow('2025-12-21T22:00:00');
    const result = getNextReminderRelativeTime('8:00 AM');
    expect(result).toBe('Tomorrow at 8am');
  });

  it('handles midnight edge case', () => {
    // Current time: 11:00 PM, reminder at 12:00 AM
    // Since 12:00 AM is technically the next calendar day, it shows "Tomorrow at 12am"
    mockNow('2025-12-21T23:00:00');
    const result = getNextReminderRelativeTime('12:00 AM');
    expect(result).toBe('Tomorrow at 12am');
  });
});

describe('createDateFromTimeString', () => {
  afterEach(() => {
    restoreTime();
  });

  it('parses AM time correctly', () => {
    mockNow('2025-12-21T12:00:00');
    const result = createDateFromTimeString('8:00 AM');
    expect(result.getHours()).toBe(8);
    expect(result.getMinutes()).toBe(0);
  });

  it('parses PM time correctly', () => {
    mockNow('2025-12-21T12:00:00');
    const result = createDateFromTimeString('2:30 PM');
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });

  it('parses 12:00 PM correctly (noon)', () => {
    mockNow('2025-12-21T10:00:00');
    const result = createDateFromTimeString('12:00 PM');
    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(0);
  });

  it('parses 12:00 AM correctly (midnight)', () => {
    mockNow('2025-12-21T10:00:00');
    const result = createDateFromTimeString('12:00 AM');
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
  });

  it('parses 24-hour format correctly', () => {
    mockNow('2025-12-21T12:00:00');
    const result = createDateFromTimeString('14:30');
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });

  it('returns fallback for invalid input', () => {
    mockNow('2025-12-21T12:00:00');
    const fallback = new Date('2025-12-21T09:00:00');
    const result = createDateFromTimeString('invalid', fallback);
    expect(result.getHours()).toBe(fallback.getHours());
    expect(result.getMinutes()).toBe(fallback.getMinutes());
  });
});

describe('formatReminderTime', () => {
  it('formats morning time correctly', () => {
    const date = new Date();
    date.setHours(8, 0, 0, 0);
    expect(formatReminderTime(date)).toBe('8:00 AM');
  });

  it('formats afternoon time correctly', () => {
    const date = new Date();
    date.setHours(14, 30, 0, 0);
    expect(formatReminderTime(date)).toBe('2:30 PM');
  });

  it('formats noon correctly', () => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    expect(formatReminderTime(date)).toBe('12:00 PM');
  });

  it('formats midnight correctly', () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    expect(formatReminderTime(date)).toBe('12:00 AM');
  });

  it('pads minutes with leading zero', () => {
    const date = new Date();
    date.setHours(9, 5, 0, 0);
    expect(formatReminderTime(date)).toBe('9:05 AM');
  });
});
