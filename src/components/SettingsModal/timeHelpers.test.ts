import { formatDisplayTime, formatStreakReminderSubtitle } from './timeHelpers';

describe('formatStreakReminderSubtitle', () => {
  it('reports Off when reminders are disabled', () => {
    expect(formatStreakReminderSubtitle(false, '20:00')).toBe('Off');
  });

  it('reports the live time when reminders are on', () => {
    expect(formatStreakReminderSubtitle(true, '20:00')).toBe('On · 8:00 PM');
    expect(formatStreakReminderSubtitle(true, '08:05')).toBe('On · 8:05 AM');
  });
});

describe('formatDisplayTime', () => {
  it('formats 24h strings for the settings row', () => {
    expect(formatDisplayTime('20:00')).toBe('8:00 PM');
  });
});
