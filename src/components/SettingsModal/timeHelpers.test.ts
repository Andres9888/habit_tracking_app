import { formatDisplayTime, formatStreakReminderSubtitle } from './timeHelpers';

describe('formatStreakReminderSubtitle', () => {
  it('reports Off when reminders are disabled', () => {
    expect(formatStreakReminderSubtitle(false, '20:00')).toEqual({
      subtitle: 'Off',
    });
  });

  it('splits the live time into an emphasised span when reminders are on', () => {
    expect(formatStreakReminderSubtitle(true, '20:00')).toEqual({
      strong: '8:00 PM',
      subtitle: 'Every day at ',
    });
    expect(formatStreakReminderSubtitle(true, '08:05')).toEqual({
      strong: '8:05 AM',
      subtitle: 'Every day at ',
    });
  });
});

describe('formatDisplayTime', () => {
  it('formats 24h strings for the settings row', () => {
    expect(formatDisplayTime('20:00')).toBe('8:00 PM');
  });
});
